import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"

interface MLBidAnalysis {
  capacityScore: number
  riskLevel: string
  recommendation: string
  warnings: string[]
  strengths: string[]
  overallScore: number
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const body = await request.json()
    const {
      bidAmount,
      projectBudget,
      ongoingProjects,
      conflictingDeadlines,
      employeeCount,
      companyCapacity,
      financialStability,
      timeline,
      experience
    } = body

    // ML Analysis Logic
    const analysis: MLBidAnalysis = {
      capacityScore: 0,
      riskLevel: "LOW",
      recommendation: "APPROVED",
      warnings: [],
      strengths: [],
      overallScore: 0
    }

    // 1. Capacity Analysis
    const capacityScore = analyzeCapacity(
      parseInt(ongoingProjects),
      parseInt(conflictingDeadlines),
      parseInt(employeeCount),
      parseInt(companyCapacity)
    )
    analysis.capacityScore = capacityScore

    // 2. Financial Analysis
    const financialScore = analyzeFinancialStability(
      parseFloat(bidAmount),
      parseFloat(projectBudget),
      financialStability
    )

    // 3. Risk Assessment
    const riskAssessment = assessRisk(
      parseInt(ongoingProjects),
      parseInt(conflictingDeadlines),
      parseInt(employeeCount),
      parseInt(companyCapacity),
      financialStability,
      parseFloat(bidAmount),
      parseFloat(projectBudget)
    )
    analysis.riskLevel = riskAssessment.riskLevel
    analysis.warnings = riskAssessment.warnings
    analysis.strengths = riskAssessment.strengths

    // 4. Generate Recommendation
    analysis.recommendation = generateRecommendation(
      capacityScore,
      financialScore,
      riskAssessment.riskLevel,
      parseFloat(bidAmount),
      parseFloat(projectBudget)
    )

    // 5. Calculate Overall Score
    analysis.overallScore = Math.round(
      (capacityScore * 0.4) + 
      (financialScore * 0.3) + 
      (riskAssessment.score * 0.3)
    )

    return NextResponse.json({
      success: true,
      analysis,
      message: "Bid analyzed successfully"
    })

  } catch (error) {
    console.error("Error analyzing bid:", error)
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    )
  }
}

function analyzeCapacity(
  ongoingProjects: number,
  conflictingDeadlines: number,
  employeeCount: number,
  companyCapacity: number
): number {
  let score = 100

  // Deduct points for ongoing projects (resource allocation)
  if (ongoingProjects > 5) {
    score -= 20
  } else if (ongoingProjects > 3) {
    score -= 10
  } else if (ongoingProjects > 1) {
    score -= 5
  }

  // Deduct points for conflicting deadlines (scheduling conflicts)
  if (conflictingDeadlines > 2) {
    score -= 25
  } else if (conflictingDeadlines > 0) {
    score -= 15
  }

  // Deduct points for low employee count (capacity constraints)
  if (employeeCount < 10) {
    score -= 20
  } else if (employeeCount < 25) {
    score -= 10
  }

  // Deduct points for low available capacity
  if (companyCapacity < 30) {
    score -= 30
  } else if (companyCapacity < 50) {
    score -= 20
  } else if (companyCapacity < 70) {
    score -= 10
  }

  return Math.max(0, score)
}

function analyzeFinancialStability(
  bidAmount: number,
  projectBudget: number,
  financialStability: string
): number {
  let score = 100

  // Analyze bid amount vs budget
  const budgetRatio = bidAmount / projectBudget
  if (budgetRatio > 1.2) {
    score -= 30 // Over-bidding
  } else if (budgetRatio < 0.8) {
    score -= 20 // Under-bidding (might indicate desperation)
  } else if (budgetRatio >= 0.9 && budgetRatio <= 1.1) {
    score += 10 // Optimal bidding range
  }

  // Analyze financial stability rating
  switch (financialStability) {
    case "excellent":
      score += 20
      break
    case "good":
      score += 10
      break
    case "average":
      score += 0
      break
    case "fair":
      score -= 15
      break
    case "poor":
      score -= 30
      break
    default:
      score -= 10
  }

  return Math.max(0, Math.min(100, score))
}

function assessRisk(
  ongoingProjects: number,
  conflictingDeadlines: number,
  employeeCount: number,
  companyCapacity: number,
  financialStability: string,
  bidAmount: number,
  projectBudget: number
): { riskLevel: string; warnings: string[]; strengths: string[]; score: number } {
  const warnings: string[] = []
  const strengths: string[] = []
  let riskScore = 100

  // High ongoing projects
  if (ongoingProjects > 5) {
    warnings.push("High number of ongoing projects may affect resource allocation")
    riskScore -= 25
  } else if (ongoingProjects <= 2) {
    strengths.push("Low ongoing project count indicates good resource availability")
    riskScore += 10
  }

  // Conflicting deadlines
  if (conflictingDeadlines > 2) {
    warnings.push("Multiple conflicting deadlines detected - high scheduling risk")
    riskScore -= 30
  } else if (conflictingDeadlines === 0) {
    strengths.push("No conflicting deadlines - good project scheduling")
    riskScore += 15
  }

  // Employee count
  if (employeeCount < 10) {
    warnings.push("Small team size may limit project execution capacity")
    riskScore -= 20
  } else if (employeeCount > 50) {
    strengths.push("Large team indicates strong execution capability")
    riskScore += 10
  }

  // Company capacity
  if (companyCapacity < 30) {
    warnings.push("Very low available capacity - high resource constraint risk")
    riskScore -= 35
  } else if (companyCapacity > 80) {
    strengths.push("High available capacity - excellent resource availability")
    riskScore += 15
  }

  // Financial stability
  if (financialStability === "poor" || financialStability === "fair") {
    warnings.push("Low financial stability rating - payment risk")
    riskScore -= 25
  } else if (financialStability === "excellent") {
    strengths.push("Excellent financial stability - low payment risk")
    riskScore += 20
  }

  // Bid amount analysis
  const budgetRatio = bidAmount / projectBudget
  if (budgetRatio < 0.8) {
    warnings.push("Bid significantly below budget - potential quality concerns")
    riskScore -= 15
  } else if (budgetRatio > 1.2) {
    warnings.push("Bid significantly above budget - cost efficiency concerns")
    riskScore -= 10
  }

  // Determine risk level
  let riskLevel = "LOW"
  if (riskScore < 40) {
    riskLevel = "HIGH"
  } else if (riskScore < 70) {
    riskLevel = "MEDIUM"
  }

  return {
    riskLevel,
    warnings,
    strengths,
    score: Math.max(0, riskScore)
  }
}

function generateRecommendation(
  capacityScore: number,
  financialScore: number,
  riskLevel: string,
  bidAmount: number,
  projectBudget: number
): string {
  const budgetRatio = bidAmount / projectBudget

  if (riskLevel === "HIGH") {
    return "REJECTED - High risk factors detected"
  }

  if (capacityScore < 50) {
    return "REJECTED - Insufficient capacity for project execution"
  }

  if (financialScore < 40) {
    return "REJECTED - Financial stability concerns"
  }

  if (budgetRatio < 0.8) {
    return "REVIEW REQUIRED - Bid significantly below budget"
  }

  if (budgetRatio > 1.2) {
    return "REVIEW REQUIRED - Bid significantly above budget"
  }

  if (capacityScore >= 80 && financialScore >= 80 && riskLevel === "LOW") {
    return "APPROVED - Excellent capacity and financial standing"
  }

  if (capacityScore >= 70 && financialScore >= 70) {
    return "APPROVED - Good capacity and financial standing"
  }

  return "REVIEW REQUIRED - Moderate risk factors present"
}
