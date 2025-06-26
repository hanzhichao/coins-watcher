// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
mod command;
mod fns;
mod tray;

use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_store::Builder::new().build())
    .invoke_handler(tauri::generate_handler![
      command::init,
      command::show_menubar_panel
    ])
    .plugin(tauri_nspanel::init())
    .setup(|app| {
      app.set_activation_policy(tauri::ActivationPolicy::Accessory);
      let app_handle = app.app_handle();
      tray::create(app_handle)?;
      Ok(())
    })
    .plugin(tauri_plugin_opener::init())
    .plugin(tauri_plugin_notification::init())
    .plugin(tauri_plugin_http::init())
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
