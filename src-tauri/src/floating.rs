#[tauri::command]
pub async fn resize_floating(
    window: tauri::Window,
    x: i32,
    y: i32,
    width: u32,
    height: u32,
) -> Result<(), String> {
    if window.label() != "main" || width == 0 || height == 0 || width > 32768 || height > 32768 {
        return Err("Invalid companion bounds".into());
    }
    let (sender, receiver) = std::sync::mpsc::channel();
    let native = window.clone();
    window.run_on_main_thread(move || {
        let result = native
            .set_position(tauri::PhysicalPosition::new(x, y))
            .and_then(|_| native.set_size(tauri::PhysicalSize::new(width, height)))
            .map_err(|error| error.to_string());
        let _ = sender.send(result);
    }).map_err(|error| error.to_string())?;
    let response = tauri::async_runtime::spawn_blocking(move || receiver.recv())
        .await.map_err(|error| error.to_string())?;
    response.map_err(|error| error.to_string())?
}
