use axum::{Router, Json, extract::Path};
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use chrono::Utc;

#[derive(Deserialize)]
struct ContactRequest { name: String, email: Option<String>, phone: Option<String>, company: Option<String> }
#[derive(Serialize)]
struct Contact { id: String, name: String, email: String, phone: String, company: String, created_at: String }
#[derive(Serialize)]
struct Interaction { id: String, contact_id: String, kind: String, notes: String, date: String }

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();
    let app = Router::new()
        .route("/", axum::routing::get(root))
        .route("/health", axum::routing::get(health))
        .route("/contacts", axum::routing::get(list_contacts).post(create_contact))
        .route("/contacts/:id/interactions", axum::routing::get(get_interactions))
        .layer(tower_http::cors::CorsLayer::permissive());
    let port = std::env::var("PORT").unwrap_or_else(|_| "3001".into());
    let listener = tokio::net::TcpListener::bind(format!("0.0.0.0:{}", port)).await.unwrap();
    tracing::info!("monicahq backend running on :{}", port);
    axum::serve(listener, app).await.unwrap();
}

async fn root() -> Json<serde_json::Value> { Json(serde_json::json!({"service": "monicahq", "status": "running"})) }
async fn health() -> Json<serde_json::Value> { Json(serde_json::json!({"status": "healthy"})) }

async fn list_contacts() -> Json<serde_json::Value> {
    let contacts = vec![
        Contact { id: "1".into(), name: "Alice Johnson".into(), email: "alice@example.com".into(), phone: "555-0101".into(), company: "Acme Inc".into(), created_at: Utc::now().to_rfc3339() },
        Contact { id: "2".into(), name: "Bob Smith".into(), email: "bob@example.com".into(), phone: "555-0102".into(), company: "Tech Co".into(), created_at: Utc::now().to_rfc3339() },
    ];
    Json(serde_json::json!({ "contacts": contacts }))
}

async fn create_contact(Json(req): Json<ContactRequest>) -> Json<serde_json::Value> {
    let contact = Contact { id: Uuid::new_v4().to_string(), name: req.name, email: req.email.unwrap_or_default(), phone: req.phone.unwrap_or_default(), company: req.company.unwrap_or_default(), created_at: Utc::now().to_rfc3339() };
    Json(serde_json::json!({ "contact": contact }))
}

async fn get_interactions(Path(contact_id): Path<String>) -> Json<serde_json::Value> {
    let interactions = vec![
        Interaction { id: "1".into(), contact_id: contact_id.clone(), kind: "meeting".into(), notes: "Discussed project timeline".into(), date: Utc::now().to_rfc3339() },
    ];
    Json(serde_json::json!({ "interactions": interactions, "contact_id": contact_id }))
}
