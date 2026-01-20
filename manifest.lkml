project_name: "schedule-history"

application: schedule-history {
  label: "Schedule History"
  url: "https://localhost:8080/dist/bundle.js"
  entitlements: {
    navigation: yes
    use_embeds: yes
    use_clipboard: yes
    core_api_methods: ["scheduled_plan", "all_scheduled_plans", "scheduled_plan_run_once"]
  }
}
