mod floating;
mod lifecycle;
mod local_planner;
mod local_plan;

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::default().build())
        .invoke_handler(tauri::generate_handler![floating::resize_floating, lifecycle::quit_app, local_planner::local_quest, local_planner::local_model_available, local_plan::local_quest_plan])
        .run(tauri::generate_context!())
        .expect("Inova could not start");
}
