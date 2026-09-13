package com.linkshifter.service;

public class UserAgentParser {

    public static String detectDevice(String ua) {
        if (ua == null) return "Unknown";
        String lower = ua.toLowerCase();
        if (lower.contains("mobile") || lower.contains("android") || lower.contains("iphone")) {
            return "Mobile";
        }
        if (lower.contains("tablet") || lower.contains("ipad")) {
            return "Tablet";
        }
        return "Desktop";
    }

    public static String detectBrowser(String ua) {
        if (ua == null) return "Other";
        String lower = ua.toLowerCase();
        if (lower.contains("edg")) return "Edge";
        if (lower.contains("opr") || lower.contains("opera")) return "Opera";
        if (lower.contains("chrome")) return "Chrome";
        if (lower.contains("firefox")) return "Firefox";
        if (lower.contains("safari") && !lower.contains("chrome")) return "Safari";
        return "Other";
    }

    public static String detectOS(String ua) {
        if (ua == null) return "Other";
        String lower = ua.toLowerCase();
        if (lower.contains("win")) return "Windows";
        if (lower.contains("mac")) return "macOS";
        if (lower.contains("linux")) return "Linux";
        if (lower.contains("android")) return "Android";
        if (lower.contains("iphone") || lower.contains("ipad")) return "iOS";
        return "Other";
    }
}
