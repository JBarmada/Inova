use crate::local_planner::{read_bounded, validate_model};
use serde_json::{json, Value};
use std::time::Duration;

#[tauri::command]
pub async fn local_companion_reply(input: String, model: String) -> Result<String, String> {
    validate_model(&model)?;
    if input.len() > 24000 { return Err("Conversation context is too large.".into()); }
    let client = reqwest::Client::builder().no_proxy().redirect(reqwest::redirect::Policy::none())
        .connect_timeout(Duration::from_secs(2)).timeout(Duration::from_secs(120))
        .build().map_err(|_| "Could not initialize local AI.")?;
    let payload = json!({
        "model": model, "stream": false,
        "format": {"type":"object", "properties":{"reply":{"type":"string"}, "memoryQuote":{"type":"string"},
            "memoryCategory":{"type":"string", "enum":["people", "events", "you", "misc"]}, "offerQuest":{"type":"boolean"}},
            "required":["reply", "memoryQuote", "memoryCategory", "offerQuest"]},
        "messages": [
            {"role":"system", "content":include_str!("local_chat_prompt.txt")},
            {"role":"user", "content":input}
        ], "options":{"temperature":0.3, "num_predict":120, "num_ctx":4096}
    });
    let response = client.post("http://127.0.0.1:11434/api/chat").json(&payload).send().await
        .map_err(|_| "Local AI is unavailable or timed out.")?;
    if !response.status().is_success() { return Err("Local AI could not respond. Check the selected model.".into()); }
    let bytes = read_bounded(response, 65536).await?;
    let value: Value = serde_json::from_slice(&bytes).map_err(|_| "Local AI returned an invalid response.")?;
    value.pointer("/message/content").and_then(Value::as_str).map(str::to_owned)
        .ok_or_else(|| "Local AI response was missing its content.".into())
}
