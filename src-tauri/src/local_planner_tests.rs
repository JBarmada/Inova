use super::{read_bounded, validate_model};
use std::io::{Read, Write};
use std::net::TcpListener;
use std::thread;

fn response_from_server(body: &'static [u8]) -> reqwest::Response {
    let listener = TcpListener::bind("127.0.0.1:0").unwrap();
    let address = listener.local_addr().unwrap();
    thread::spawn(move || {
        let (mut stream, _) = listener.accept().unwrap();
        let mut request = [0; 1024];
        let _ = stream.read(&mut request);
        let _ = stream.write_all(body);
    });
    tauri::async_runtime::block_on(async {
        reqwest::Client::builder().no_proxy().build().unwrap()
            .get(format!("http://{address}/")).send().await.unwrap()
    })
}

#[test]
fn rejects_oversized_declared_and_chunked_responses() {
    let declared = response_from_server(b"HTTP/1.1 200 OK\r\nContent-Length: 9\r\n\r\n123456789");
    assert!(tauri::async_runtime::block_on(read_bounded(declared, 8)).unwrap_err().contains("too large"));
    let chunked = response_from_server(b"HTTP/1.1 200 OK\r\nTransfer-Encoding: chunked\r\n\r\n5\r\nhello\r\n4\r\n1234\r\n0\r\n\r\n");
    assert!(tauri::async_runtime::block_on(read_bounded(chunked, 8)).unwrap_err().contains("too large"));
}

#[test]
fn accepts_a_response_at_the_limit_and_only_supported_models() {
    let response = response_from_server(b"HTTP/1.1 200 OK\r\nContent-Length: 8\r\n\r\n12345678");
    assert_eq!(tauri::async_runtime::block_on(read_bounded(response, 8)).unwrap(), b"12345678");
    assert!(validate_model("gemma3:12b").is_ok());
    assert!(validate_model("gemma3:4b").is_ok());
    assert!(validate_model("other").is_err());
}
