mod floating;

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::default().build())
        .invoke_handler(tauri::generate_handler![floating::resize_floating])
        .run(tauri::generate_context!())
        .expect("Inova could not start");
}
