output "alb_dns_name" {
  description = "Public DNS name of the load balancer - use this to reach the app if no domain is configured"
  value       = aws_lb.main.dns_name
}

output "app_url" {
  description = "URL the app is reachable at (custom domain if configured, otherwise the ALB DNS name)"
  value       = var.domain_name != "" ? "https://${var.app_subdomain}.${var.domain_name}" : "http://${aws_lb.main.dns_name}"
}

output "rds_endpoint" {
  description = "RDS MySQL connection endpoint (private - only reachable from the app subnets)"
  value       = aws_db_instance.main.address
}

output "vpc_id" {
  value = aws_vpc.main.id
}

output "asg_name" {
  value = aws_autoscaling_group.app.name
}
