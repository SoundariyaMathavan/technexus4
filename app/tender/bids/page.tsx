"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Users, 
  Search, 
  Filter, 
  Calendar, 
  Building2, 
  DollarSign, 
  Eye, 
  TrendingUp, 
  Star,
  Award,
  Clock,
  MapPin,
  Phone,
  Mail,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react"
import Link from "next/link"

interface Bidder {
  _id: string
  bidderId: string
  bidderName: string
  companyName: string
  email: string
  phone: string
  location: string
  bidAmount: number
  proposal: string
  timeline: string
  experience: string
  qualifications: string[]
  references: string[]
  documents: string[]
  status: string
  rank: number
  percentile: number
  score: number
  submittedAt: string
  verificationStatus: string
  projectProgress: number
}

interface Project {
  _id: string
  title: string
  description: string
  budget: number
  deadline: string
  status: string
  bidCount: number
  category: string
  location: string
  bidders: Bidder[]
}

export default function BidsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [expandedBidders, setExpandedBidders] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!user || user.userType !== "tender") {
      router.push("/auth/signin")
      return
    }

    fetchProjectsWithBids()
  }, [user, router])

  const fetchProjectsWithBids = async () => {
    try {
      const token = localStorage.getItem("auth_token")
      if (!token) return

      // Fetch projects
      const projectsResponse = await fetch("/api/projects/my-projects", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json()
        const projectsWithBids = (projectsData.projects || []).filter((project: any) => 
          project.bidCount > 0
        )

        // Fetch bids for each project
        const projectsWithBidders = await Promise.all(
          projectsWithBids.map(async (project: any) => {
            try {
              const bidsResponse = await fetch(`/api/bids?projectId=${project._id}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              })

              if (bidsResponse.ok) {
                const bidsData = await bidsResponse.json()
                const bidders = bidsData.bids || []
                
                // Sort bidders by rank
                const sortedBidders = bidders.sort((a: Bidder, b: Bidder) => 
                  (a.rank || 999) - (b.rank || 999)
                )

                return {
                  ...project,
                  bidders: sortedBidders
                }
              }
              return { ...project, bidders: [] }
            } catch (error) {
              console.error(`Error fetching bids for project ${project._id}:`, error)
              return { ...project, bidders: [] }
            }
          })
        )

        setProjects(projectsWithBidders)
      }
    } catch (error) {
      console.error("Error fetching projects with bids:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800"
      case "active":
        return "bg-blue-100 text-blue-800"
      case "closed":
        return "bg-gray-100 text-gray-800"
      case "awarded":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getBidStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-blue-100 text-blue-800"
      case "under_review":
        return "bg-yellow-100 text-yellow-800"
      case "shortlisted":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "awarded":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getVerificationStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const toggleBidderExpansion = (bidderId: string) => {
    const newExpanded = new Set(expandedBidders)
    if (newExpanded.has(bidderId)) {
      newExpanded.delete(bidderId)
    } else {
      newExpanded.add(bidderId)
    }
    setExpandedBidders(newExpanded)
  }

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || project.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search projects or bidders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
              <SelectItem value="awarded">Awarded</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Projects with Bidders */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bids yet</h3>
            <p className="text-gray-500 mb-4">
              {projects.length === 0 
                ? "You don't have any projects with bids yet." 
                : "No projects match your current filters."}
            </p>
            {projects.length === 0 && (
              <Link href="/tender/projects/new">
                <Button>
                  <Building2 className="h-4 w-4 mr-2" />
                  Create a Project
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {filteredProjects.map((project) => (
              <Card key={project._id} className="overflow-hidden">
                <CardHeader className="bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-primary" />
                        {project.title}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {project.description}
                      </CardDescription>
                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          Budget: ${project.budget?.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Deadline: {new Date(project.deadline).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {project.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {project.bidCount} bidders
                        </div>
                      </div>
                    </div>
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="p-0">
                  <div className="divide-y">
                    {project.bidders.map((bidder, index) => (
                      <div key={bidder._id} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                          {/* Bidder Basic Info */}
                          <div className="flex items-start gap-4 flex-1">
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <Avatar className="h-12 w-12">
                                  <AvatarImage src={`https://ui-avatars.com/api/?name=${bidder.bidderName}&background=random`} />
                                  <AvatarFallback>{bidder.bidderName?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="absolute -top-1 -right-1">
                                  {getVerificationStatusIcon(bidder.verificationStatus || "pending")}
                                </div>
                              </div>
                              
                              {/* Ranking Badge */}
                              <div className="flex flex-col items-center">
                                <Badge variant={index === 0 ? "default" : "secondary"} className="mb-1">
                                  #{bidder.rank || index + 1}
                                </Badge>
                                {bidder.percentile && (
                                  <span className="text-xs text-gray-500">
                                    Top {bidder.percentile}%
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-lg font-semibold">{bidder.bidderName || 'Unknown Bidder'}</h3>
                                <Badge className={getBidStatusColor(bidder.status)}>
                                  {bidder.status || 'submitted'}
                                </Badge>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <span className="font-medium text-gray-700">Company:</span>
                                  <p className="text-gray-600">{bidder.companyName || 'Not specified'}</p>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-700">Bid Amount:</span>
                                  <p className="text-green-600 font-semibold">${bidder.bidAmount ? bidder.bidAmount.toLocaleString() : 'Not specified'}</p>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-700">Location:</span>
                                  <p className="text-gray-600">{bidder.location || 'Not specified'}</p>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-700">Score:</span>
                                  <p className="text-blue-600 font-semibold">{bidder.score || "N/A"}/100</p>
                                </div>
                              </div>

                              {/* Progress Bar */}
                              <div className="mt-3">
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="text-gray-600">Project Progress</span>
                                  <span className="text-gray-600">{bidder.projectProgress || 0}%</span>
                                </div>
                                <Progress value={bidder.projectProgress || 0} className="h-2" />
                              </div>

                              {/* Contact Info */}
                              <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <Mail className="h-4 w-4" />
                                  {bidder.email}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Phone className="h-4 w-4" />
                                  {bidder.phone}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col gap-2 ml-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleBidderExpansion(bidder._id)}
                            >
                              {expandedBidders.has(bidder._id) ? "Hide Details" : "View Details"}
                            </Button>
                            <Link href={`/tender/bids/${bidder._id}/proposal`}>
                              <Button size="sm">
                                <FileText className="h-4 w-4 mr-1" />
                                Proposal
                              </Button>
                            </Link>
                          </div>
                        </div>

                        {/* Expanded Details */}
                        {expandedBidders.has(bidder._id) && (
                          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Proposal Details */}
                              <div>
                                <h4 className="font-semibold mb-3 flex items-center gap-2">
                                  <FileText className="h-4 w-4" />
                                  Proposal Summary
                                </h4>
                                <p className="text-gray-700 text-sm leading-relaxed">
                                  {bidder.proposal?.substring(0, 300)}
                                  {bidder.proposal && bidder.proposal.length > 300 && "..."}
                                </p>
                              </div>

                              {/* Timeline & Experience */}
                              <div>
                                <h4 className="font-semibold mb-3 flex items-center gap-2">
                                  
                                  Timeline & Experience
                                </h4>
                                <div className="space-y-2 text-sm">
                                  <div>
                                    <span className="font-medium text-gray-700">Timeline:</span>
                                    <p className="text-gray-600">
                                      {typeof bidder.timeline === 'string' 
                                        ? bidder.timeline 
                                        : 'Not specified'}
                                    </p>
                                  </div>
                                  <div>
                                    <span className="font-medium text-gray-700">Experience:</span>
                                    <p className="text-gray-600">
                                      {typeof bidder.experience === 'string' 
                                        ? bidder.experience 
                                        : 'Not specified'}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Qualifications */}
                              <div>
                                <h4 className="font-semibold mb-3 flex items-center gap-2">
                                  <Award className="h-4 w-4" />
                                  Qualifications
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {Array.isArray(bidder.qualifications) 
                                    ? bidder.qualifications.map((qual, idx) => (
                                        <Badge key={idx} variant="outline" className="text-xs">
                                          {typeof qual === 'string' ? qual : 'Qualification'}
                                        </Badge>
                                      ))
                                    : <span className="text-gray-500 text-sm">No qualifications listed</span>
                                  }
                                </div>
                              </div>

                              {/* Documents */}
                              <div>
                                <h4 className="font-semibold mb-3 flex items-center gap-2">
                                  <FileText className="h-4 w-4" />
                                  Documents ({Array.isArray(bidder.documents) ? bidder.documents.length : 0})
                                </h4>
                                <div className="space-y-1">
                                  {Array.isArray(bidder.documents) 
                                    ? bidder.documents.map((doc, idx) => (
                                        <div key={idx} className="text-sm text-blue-600 hover:underline cursor-pointer">
                                          📄 {typeof doc === 'string' ? doc : 'Document'}
                                        </div>
                                      ))
                                    : <span className="text-gray-500 text-sm">No documents uploaded</span>
                                  }
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 