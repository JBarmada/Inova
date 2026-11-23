#[tauri::command]
pub fn quit_app(window: tauri::Window) -> Result<(), String> {
    if window.label() != "main" {
        return Err("Quit is only available from the main Inova window".into());
    }
    // Tear down the webview first; Tauri exits when its last window is gone.
    window.destroy().map_err(|error| error.to_string())
}
