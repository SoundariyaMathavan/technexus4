"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Star, Building2, Users, Shield, Zap, Globe, Award, FileText, TrendingUp, Lock, Crown } from "lucide-react"

const plans = [
  {
    name: "Free Plan",
    price: "$0",
    period: "forever",
    description: "Perfect for small businesses getting started with tendering",
    features: [
      "Create up to 5 tender projects",
      "Upload 5 bidder documents",
      "Basic project management",
      "Email support",
      "Standard templates",
      "Basic analytics dashboard",
      "Up to 10 bids per project",
      "Community forum access"
    ],
    limitations: [
      "Limited to 5 projects",
      "Basic support only",
      "No advanced analytics",
      "No priority support"
    ],
    buttonText: "Get Started Free",
    buttonVariant: "outline" as const,
    popular: false,
    paymentLink: null
  },
  {
    name: "Subscription Plan",
    price: "₹999",
    period: "per month",
    description: "Ideal for growing businesses with unlimited tendering needs",
    features: [
      "Unlimited tender projects",
      "Unlimited bidder documents",
      "Advanced project management",
      "Priority email & chat support",
      "Custom templates & branding",
      "Advanced analytics & reporting",
      "Unlimited bids per project",
      "AI-powered bid analysis",
      "Automated evaluation tools",
      "Real-time notifications",
      "Mobile app access",
      "API access for integrations",
      "Dedicated account manager",
      "Training & onboarding support"
    ],
    limitations: [
      "Monthly commitment required",
      "No enterprise features"
    ],
    buttonText: "Subscribe Now",
    buttonVariant: "default" as const,
    popular: true,
    paymentLink: "https://rzp.io/rzp/4PBLM9S"
  },
  {
    name: "Enterprise Plan",
    price: "Custom",
    period: "contact us",
    description: "Complete solution for large organizations with advanced collaboration",
    features: [
      "Everything in Subscription Plan",
      "Unlimited everything",
      "Community collaboration tools",
      "Multi-tenant architecture",
      "Advanced security & compliance",
      "Custom integrations",
      "White-label solutions",
      "Advanced workflow automation",
      "Comprehensive audit trails",
      "24/7 phone support",
      "On-site training",
      "Custom development",
      "SLA guarantees",
      "Dedicated success team",
      "Advanced reporting & BI",
      "Blockchain verification",
      "AI-powered insights",
      "Multi-language support",
      "Advanced user management",
      "Custom branding & themes"
    ],
    limitations: [
      "Requires annual commitment",
      "Custom pricing based on needs"
    ],
    buttonText: "Contact Sales",
    buttonVariant: "default" as const,
    popular: false,
    paymentLink: "https://rzp.io/rzp/CtZSgjjc"
  }
]

export default function PricingPage() {
  const [annualBilling, setAnnualBilling] = useState(false)

  const handlePlanClick = (plan: typeof plans[0]) => {
    if (plan.paymentLink) {
      window.open(plan.paymentLink, '_blank')
    } else {
      // For free plan, redirect to signup
      window.location.href = '/auth/signup'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Perfect Plan
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Revolutionize your tendering process with our flexible pricing plans designed for businesses of all sizes
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-lg p-1 shadow-sm border">
            <div className="flex items-center space-x-4">
              <span className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                !annualBilling ? 'bg-blue-600 text-white' : 'text-gray-600'
              }`}>
                Monthly
              </span>
              <span className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                annualBilling ? 'bg-blue-600 text-white' : 'text-gray-600'
              }`}>
                Annual
                <Badge className="ml-2 bg-green-100 text-green-800 text-xs">
                  Save 20%
                </Badge>
              </span>
            </div>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={plan.name} 
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl ${
                plan.popular 
                  ? 'ring-2 ring-blue-500 scale-105' 
                  : 'hover:scale-105'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-2 text-sm font-medium">
                  <Star className="inline h-4 w-4 mr-1" />
                  Most Popular
                </div>
              )}

              <CardHeader className={`text-center ${plan.popular ? 'pt-12' : 'pt-8'}`}>
                <div className="flex items-center justify-center mb-4">
                  {plan.name === "Free Plan" && <Users className="h-8 w-8 text-blue-600 mr-2" />}
                  {plan.name === "Subscription Plan" && <Crown className="h-8 w-8 text-purple-600 mr-2" />}
                  {plan.name === "Enterprise Plan" && <Building2 className="h-8 w-8 text-green-600 mr-2" />}
                </div>
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <CardDescription className="text-gray-600 mt-2">
                  {plan.description}
                </CardDescription>
                
                <div className="mt-6">
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-gray-900">
                      {plan.price}
                    </span>
                    {plan.period !== "forever" && plan.period !== "contact us" && (
                      <span className="text-gray-600 ml-1">
                        /{annualBilling ? 'year' : 'month'}
                      </span>
                    )}
                  </div>
                  {plan.period === "forever" && (
                    <p className="text-green-600 font-medium">No credit card required</p>
                  )}
                  {plan.period === "contact us" && (
                    <p className="text-gray-600">Custom pricing for your needs</p>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Features */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    What's included:
                  </h3>
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className="h-4 w-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Limitations */}
                {plan.limitations.length > 0 && (
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="font-semibold text-gray-900 flex items-center">
                      <Lock className="h-5 w-5 text-gray-500 mr-2" />
                      Limitations:
                    </h3>
                    <ul className="space-y-2">
                      {plan.limitations.map((limitation, limitationIndex) => (
                        <li key={limitationIndex} className="flex items-start">
                          <span className="h-4 w-4 text-gray-400 mr-3 mt-0.5 flex-shrink-0">•</span>
                          <span className="text-gray-500 text-sm">{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* CTA Button */}
                <Button 
                  className={`w-full mt-8 ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' 
                      : ''
                  }`}
                  variant={plan.buttonVariant}
                  size="lg"
                  onClick={() => handlePlanClick(plan)}
                >
                  {plan.buttonText}
                </Button>

                {/* Additional Info */}
                {plan.name === "Free Plan" && (
                  <p className="text-center text-xs text-gray-500 mt-2">
                    No credit card required • Cancel anytime
                  </p>
                )}
                {plan.name === "Subscription Plan" && (
                  <p className="text-center text-xs text-gray-500 mt-2">
                    Secure payment via Razorpay • Cancel anytime
                  </p>
                )}
                {plan.name === "Enterprise Plan" && (
                  <p className="text-center text-xs text-gray-500 mt-2">
                    Custom contract • Dedicated support
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Can I upgrade or downgrade my plan?</h3>
                <p className="text-gray-600 text-sm">Yes, you can change your plan at any time. Upgrades take effect immediately, while downgrades apply at the next billing cycle.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Is there a free trial?</h3>
                <p className="text-gray-600 text-sm">Yes! Start with our free plan to explore all basic features. No credit card required to get started.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
                <p className="text-gray-600 text-sm">We accept all major credit cards, debit cards, and UPI payments through our secure Razorpay integration.</p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Do you offer refunds?</h3>
                <p className="text-gray-600 text-sm">We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, we'll refund your payment.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Is my data secure?</h3>
                <p className="text-gray-600 text-sm">Absolutely! We use enterprise-grade security with blockchain technology to ensure your tender data is always protected.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Can I cancel anytime?</h3>
                <p className="text-gray-600 text-sm">Yes, you can cancel your subscription at any time. Your access will continue until the end of your current billing period.</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Revolutionize Your Tendering?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of businesses already using TenderChain to streamline their bidding process
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => window.location.href = '/auth/signup'}
              >
                Start Free Trial
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600"
                onClick={() => window.open('https://rzp.io/rzp/4PBLM9S', '_blank')}
              >
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 