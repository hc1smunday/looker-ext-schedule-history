project_name: "schedule-history-extension"

application: schedule_history {
  label: "Schedule History"
  url: "https://localhost:8080/bundle.js"
  entitlements: {
    core_api_methods: ["scheduled_plan", "all_scheduled_plans", "scheduled_plan_run_once"]
    navigation: yes
    use_embeds: yes
  }
}
c