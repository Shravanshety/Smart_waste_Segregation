package model;

import java.time.LocalDateTime;

public class Waste {
    private int id;
    private int userId;
    private int collectorId;
    private String wasteType; // DRY, WET, HAZARDOUS, MIXED
    private int qualityScore; // 1-10
    private int pointsEarned;
    private LocalDateTime submissionTime;
    
    public Waste() {}
    
    public Waste(int userId, int collectorId, String wasteType, int qualityScore) {
        this.userId = userId;
        this.collectorId = collectorId;
        this.wasteType = wasteType;
        this.qualityScore = qualityScore;
        this.pointsEarned = calculatePoints(wasteType, qualityScore);
        this.submissionTime = LocalDateTime.now();
    }
    
    private int calculatePoints(String wasteType, int qualityScore) {
        int basePoints = switch (wasteType) {
            case "DRY" -> 10;
            case "WET" -> 8;
            case "HAZARDOUS" -> 15;
            case "MIXED" -> 3;
            default -> 0;
        };
        return basePoints * qualityScore / 10;
    }
    
    // Getters and Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    
    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }
    
    public int getCollectorId() { return collectorId; }
    public void setCollectorId(int collectorId) { this.collectorId = collectorId; }
    
    public String getWasteType() { return wasteType; }
    public void setWasteType(String wasteType) { this.wasteType = wasteType; }
    
    public int getQualityScore() { return qualityScore; }
    public void setQualityScore(int qualityScore) { this.qualityScore = qualityScore; }
    
    public int getPointsEarned() { return pointsEarned; }
    public void setPointsEarned(int pointsEarned) { this.pointsEarned = pointsEarned; }
    
    public LocalDateTime getSubmissionTime() { return submissionTime; }
    public void setSubmissionTime(LocalDateTime submissionTime) { this.submissionTime = submissionTime; }
}