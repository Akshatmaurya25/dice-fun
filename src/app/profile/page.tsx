"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock user data
const userData = {
  name: "CryptoDev",
  ensName: "cryptodev.kda",
  address: "0x1234567890abcdef1234567890abcdef12345678",
  email: "cryptodev@example.com",
  bio: "Passionate blockchain developer building the future of DeFi on Kadena. Streaming educational content about smart contracts, security, and Web3 development.",
  avatar: "",
  isVerified: true,
  selfProtocolStatus: "verified",
  socialLinks: {
    twitter: "@cryptodev_kda",
    github: "cryptodev",
    website: "https://cryptodev.kda",
  },
  preferences: {
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: false,
    streamNotifications: true,
  },
  walletConnections: [
    {
      name: "MetaMask",
      address: "0x1234...5678",
      isActive: true,
      chain: "Polygon",
    },
    {
      name: "Kadena Wallet",
      address: "k:1234...5678",
      isActive: true,
      chain: "Kadena",
    },
  ],
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [profile, setProfile] = useState(userData)
  const [isEditing, setIsEditing] = useState(false)

  const handleSaveProfile = () => {
    // Save profile logic would go here
    setIsEditing(false)
  }

  const handleVerifyENS = () => {
    // ENS verification logic would go here
    console.log("Starting ENS verification...")
  }

  const handleSelfProtocolVerification = () => {
    // Self Protocol verification logic would go here
    console.log("Starting Self Protocol verification...")
  }

  const handleConnectWallet = (walletType: string) => {
    // Wallet connection logic would go here
    console.log(`Connecting ${walletType} wallet...`)
  }

  const handleDisconnectWallet = (address: string) => {
    // Wallet disconnection logic would go here
    console.log(`Disconnecting wallet ${address}...`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Profile & Settings</h1>
        <p className="text-muted-foreground">
          Manage your account, preferences, and wallet connections
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-2xl grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
          <TabsTrigger value="wallets">Wallets</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Profile Information
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      {isEditing ? "Cancel" : "Edit"}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar */}
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary">
                        {profile.name[0]}
                      </span>
                    </div>
                    {isEditing && (
                      <Button variant="outline" size="sm">
                        Change Avatar
                      </Button>
                    )}
                  </div>

                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Display Name
                      </label>
                      {isEditing ? (
                        <Input
                          value={profile.name}
                          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        />
                      ) : (
                        <p className="text-sm bg-muted p-2 rounded">{profile.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Email
                      </label>
                      {isEditing ? (
                        <Input
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        />
                      ) : (
                        <p className="text-sm bg-muted p-2 rounded">{profile.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Bio
                    </label>
                    {isEditing ? (
                      <textarea
                        value={profile.bio}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        className="w-full px-3 py-2 border border-input rounded-md text-sm min-h-20"
                        placeholder="Tell us about yourself..."
                      />
                    ) : (
                      <p className="text-sm bg-muted p-2 rounded">{profile.bio}</p>
                    )}
                  </div>

                  {/* Social Links */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Social Links
                    </label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="w-16 text-sm">Twitter:</span>
                        {isEditing ? (
                          <Input
                            value={profile.socialLinks.twitter}
                            onChange={(e) => setProfile({
                              ...profile,
                              socialLinks: { ...profile.socialLinks, twitter: e.target.value }
                            })}
                            className="flex-1"
                          />
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            {profile.socialLinks.twitter}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="w-16 text-sm">GitHub:</span>
                        {isEditing ? (
                          <Input
                            value={profile.socialLinks.github}
                            onChange={(e) => setProfile({
                              ...profile,
                              socialLinks: { ...profile.socialLinks, github: e.target.value }
                            })}
                            className="flex-1"
                          />
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            {profile.socialLinks.github}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="w-16 text-sm">Website:</span>
                        {isEditing ? (
                          <Input
                            value={profile.socialLinks.website}
                            onChange={(e) => setProfile({
                              ...profile,
                              socialLinks: { ...profile.socialLinks, website: e.target.value }
                            })}
                            className="flex-1"
                          />
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            {profile.socialLinks.website}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex space-x-2">
                      <Button onClick={handleSaveProfile}>
                        Save Changes
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Profile Stats */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Profile Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">1,250</div>
                    <div className="text-sm text-muted-foreground">Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">45</div>
                    <div className="text-sm text-muted-foreground">Total Streams</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">234.56</div>
                    <div className="text-sm text-muted-foreground">MATIC Earned</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Verification Tab */}
        <TabsContent value="verification" className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>ENS Verification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>ENS Name</span>
                  <Badge variant="outline">{profile.ensName}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Status</span>
                  {profile.isVerified ? (
                    <Badge className="bg-green-500 hover:bg-green-600">✓ Verified</Badge>
                  ) : (
                    <Badge variant="outline">Not Verified</Badge>
                  )}
                </div>
                {!profile.isVerified && (
                  <Button onClick={handleVerifyENS} className="w-full">
                    Verify ENS Name
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Self Protocol</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Verification Status</span>
                  {profile.selfProtocolStatus === "verified" ? (
                    <Badge className="bg-green-500 hover:bg-green-600">✓ Verified</Badge>
                  ) : profile.selfProtocolStatus === "pending" ? (
                    <Badge variant="outline" className="border-yellow-500 text-yellow-600">
                      ⏳ Pending
                    </Badge>
                  ) : (
                    <Badge variant="outline">Not Started</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Self Protocol verification provides additional trust and credibility for your streams.
                </p>
                {profile.selfProtocolStatus !== "verified" && (
                  <Button onClick={handleSelfProtocolVerification} className="w-full">
                    {profile.selfProtocolStatus === "pending" ? "Check Status" : "Start Verification"}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Wallets Tab */}
        <TabsContent value="wallets" className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Connected Wallets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.walletConnections.map((wallet, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{wallet.name}</h4>
                    <p className="text-sm text-muted-foreground font-mono">
                      {wallet.address}
                    </p>
                    <Badge variant="outline" className="mt-1">
                      {wallet.chain}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    {wallet.isActive && (
                      <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDisconnectWallet(wallet.address)}
                    >
                      Disconnect
                    </Button>
                  </div>
                </div>
              ))}

              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Connect New Wallet</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleConnectWallet("MetaMask")}
                  >
                    Connect MetaMask
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleConnectWallet("WalletConnect")}
                  >
                    Connect WalletConnect
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(profile.preferences).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </span>
                    <Button
                      variant={value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setProfile({
                        ...profile,
                        preferences: { ...profile.preferences, [key]: !value }
                      })}
                    >
                      {value ? "On" : "Off"}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Privacy & Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  🔒 Change Password
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  🔐 Enable 2FA
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  📱 Download Data
                </Button>
                <Button variant="destructive" className="w-full justify-start">
                  🗑️ Delete Account
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}