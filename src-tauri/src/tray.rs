use tauri::{
  image::Image,
  tray::{MouseButtonState, TrayIcon, TrayIconBuilder, TrayIconEvent},
  AppHandle,
};
use tauri_nspanel::ManagerExt;

use crate::fns::position_menubar_panel;

pub fn create(app_handle: &AppHandle) -> tauri::Result<TrayIcon> {
  let icon = Image::from_bytes(include_bytes!("../icons/icon.png"))?;

  TrayIconBuilder::with_id("tray")
    .icon(icon)
    .title("CoinsWatcher")
    .icon_as_template(true)
    .on_tray_icon_event(|tray, event| {
      let app_handle = tray.app_handle();

      if let TrayIconEvent::Click { button_state, .. } = event {
        if button_state == MouseButtonState::Up {
          let panel = app_handle
            .get_webview_panel("main")
            .expect("get_webview_panel失败");

          if panel.is_visible() {
            panel.order_out(None);
            return;
          }

          position_menubar_panel(app_handle, 0.0);

          panel.show();
        }
      }
    })
    .build(app_handle)
}
