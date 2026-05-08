import { useEffect, useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import api from "@/utility/axios"
import { Badge } from "@/components/ui/badge"
import { Mountain, Clock, User, Tag, CheckCircle2, MapPin, TrendingUp, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Link } from "react-router-dom"
import { useOutletContext } from "react-router-dom";

type UserProfileDto = {
  user: {
    id: string
    username: string
  }
  scans: {
    id: number | string
    userId: string
    mountainId: string
    timestamp: string
    mountainName?: string
    mountainHeight?: number
  }[]
}

type UserBoardDto = {
  boardId: string
  expiryDate: string
  username: string
  userId: string
  mountainId: string
  description: string
  tourTime: number | string
  difficulty: number | string
}

type UserPostDto = {
  id: number | string
  tagline: string
  username: string
  mountainName: string
  commentCount: number | string
  startMsg: string
  timeStamp: string
}

function UserProfilePage() {
  const outletContext = useOutletContext<{ useNewStyle?: boolean }>()
  const { id } = useParams<{ id: string }>()

  const [useNewStyle, setUseNewStyle] = useState(true)

  const [profile, setProfile] = useState<UserProfileDto | null>(null)
  const [boards, setBoards] = useState<UserBoardDto[]>([])
  const [posts, setPosts] = useState<UserPostDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const saved = localStorage.getItem("useNewStyle")
    setUseNewStyle(saved !== null ? saved === "true" : true)

    const handleStyleToggle = (event: CustomEvent) => {
      setUseNewStyle(event.detail.useNewStyle)
    }

    window.addEventListener("styleToggle", handleStyleToggle as EventListener)
    return () => {
      window.removeEventListener("styleToggle", handleStyleToggle as EventListener)
    }
  }, [])

  useEffect(() => {
    if (outletContext?.useNewStyle !== undefined) {
      setUseNewStyle(outletContext.useNewStyle)
    }
  }, [outletContext])

  useEffect(() => {
    async function loadProfile() {
      if (!id) {
        setError("Missing user id.")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError("")

        const [profileResponse, boardsResponse, postsResponse] = await Promise.all([
          api.get(`/user/${id}/profile`),
          api.get(`/user/${id}/boards`),
          api.get("/post"),
        ])

        const loadedProfile = profileResponse.data

        setProfile(loadedProfile)
        setBoards(boardsResponse.data ?? [])
        setPosts(
          (postsResponse.data ?? []).filter(
            (post: UserPostDto) => post.username === loadedProfile.user.username
          )
        )
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
          err.response?.data?.detail ||
          "Failed to load profile."
        )
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [id])

  const userScans = useMemo(() => {
    return (profile?.scans ?? [])
      .map((scan) => ({
        scanId: scan.id,
        mountainId: scan.mountainId,
        mountainName: scan.mountainName ?? "Unknown mountain",
        mountainHeight: scan.mountainHeight ?? 0,
        verifiedAt: scan.timestamp,
        difficulty: 1,
      }))
      .sort(
        (a, b) =>
          new Date(b.verifiedAt).getTime() -
          new Date(a.verifiedAt).getTime()
      )
  }, [profile])

  const userBoards = useMemo(() => {
    return boards
      .map((board) => ({
        ...board,
        mountainName: "Unknown mountain",
        difficulty: Number(board.difficulty),
        tourTime: Number(board.tourTime),
      }))
      .sort(
        (a, b) =>
          new Date(b.expiryDate).getTime() -
          new Date(a.expiryDate).getTime()
      )
  }, [boards])

  const userPosts = useMemo(() => {
    return posts
      .sort(
        (a, b) =>
          new Date(b.timeStamp).getTime() -
          new Date(a.timeStamp).getTime()
      )
  }, [posts])

  const totalSummits = userScans.length
  const uniqueSummits = useMemo(() => {
    return new Set(userScans.map((a) => a.mountainId)).size
  }, [userScans])

  const lastAchievement = userScans[0] ?? null

  const highestPeak = useMemo(() => {
    return (
      [...userScans].sort(
        (a, b) => b.mountainHeight - a.mountainHeight
      )[0] ?? null
    )
  }, [userScans])

  const mostClimbed = useMemo(() => {
    const counts = userScans.reduce<
      Record<string, { name: string; count: number }>
    >((acc, item) => {
      if (!acc[item.mountainId]) {
        acc[item.mountainId] = {
          name: item.mountainName,
          count: 0,
        }
      }
      acc[item.mountainId].count += 1
      return acc
    }, {})

    return (
      Object.values(counts).sort((a, b) => b.count - a.count)[0] ?? null
    )
  }, [userScans])

  const averageDifficulty = useMemo(() => {
    if (!userBoards.length) return "0.0"
    const sum = userBoards.reduce((acc, item) => acc + item.difficulty, 0)
    return (sum / userBoards.length).toFixed(1)
  }, [userBoards])

  const derivedLevel = getExperienceLevel(totalSummits)

  if (loading) {
    return <div className="p-8 text-slate-600 text-center">Loading profile...</div>
  }

  if (error || !profile || !profile.user) {
    return <div className="p-8 text-red-600 text-center">{error || "Profile not found."}</div>
  }

  const user = profile.user

  if (useNewStyle) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f6f7f2] via-[#f6f7f2] to-white">
        <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
          {/* Header Section */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-[#2f6b4f] to-[#316f8f] shadow-lg text-white">
              <User className="w-8 h-8" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#17231b] tracking-tight">
              @{user.username}
            </h1>
            <div className="flex items-center justify-center gap-2 mt-3">
              <Badge className="bg-[#2f6b4f] hover:bg-[#2f6b4f] text-white px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                {derivedLevel}
              </Badge>
              <div className="h-4 w-[1px] bg-[#dce3d7]" />
              <p className="text-[#647067] text-sm">Vpogled v dosežke</p>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatsCardNew title="Vsi vzponi" value={String(totalSummits)} icon={<Mountain className="w-4 h-4" />} />
            <StatsCardNew title="Unikatni vrhi" value={String(uniqueSummits)} icon={<MapPin className="w-4 h-4" />} />
            <StatsCardNew title="Objave" value={String(userPosts.length)} icon={<Activity className="w-4 h-4" />} />
            <StatsCardNew title="Težavnost" value={averageDifficulty} icon={<TrendingUp className="w-4 h-4" />} />
          </div>

          {/* Main Grid Container with items-stretch to ensure equal height */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            
            {/* Main Content: Achievements (Left Side) */}
            <div className="lg:col-span-2 flex">
              <Card className="border border-[#dce3d7] rounded-2xl shadow-sm bg-white overflow-hidden flex flex-col w-full">
                <div className="h-1.5 bg-gradient-to-r from-[#2f6b4f] to-[#316f8f]" />
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-[#17231b]">
                    <CheckCircle2 className="w-5 h-5 text-[#2f6b4f]" />
                    Verificirani dosežki
                  </CardTitle>
                </CardHeader>
                {/* flex-1 ensures this content fills the available height */}
                <CardContent 
                  className="p-6 flex-1 flex flex-col overflow-y-auto max-h-[600px]
                    [ms-overflow-style:none] 
                    [scrollbar-width:none] 
                    [&::-webkit-scrollbar]:display-none"
                >
                  {userScans.length === 0 ? (
                    <div className="flex flex-col items-center justify-center flex-1 min-h-[300px] bg-[#fbfcf8] rounded-xl border border-dashed border-[#dce3d7] text-center p-4">
                      <Mountain className="w-10 h-10 text-[#dce3d7] mb-2" />
                      <p className="text-[#647067] italic">Uporabnik še nima verificiranih vzponov.</p>
                    </div>
                  ) : (
                    userScans.map((achievement, idx) => (
                      <div key={achievement.scanId} className="group flex items-center gap-4 p-4 rounded-xl border border-[#e5eadf] hover:bg-[#f6f7f2] transition-colors">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#f0f4ea] text-[#2f6b4f] font-bold border border-[#dce3d7]">
                          {userScans.length - idx}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-[#17231b] truncate">{achievement.mountainName}</h4>
                          <div className="flex items-center gap-3 mt-1 text-xs text-[#647067]">
                            <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" /> {achievement.mountainHeight} m</span>
                            <span>•</span>
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {formatDate(achievement.verifiedAt)}</span>
                          </div>
                        </div>
                        <Badge className="bg-[#edf8ee] text-[#275b35] border-[#bcd8c2] shadow-none hidden sm:flex">
                          Preverjeno
                        </Badge>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar: Boards & Posts (Right Side) */}
            <div className="space-y-6 flex flex-col">
              {/* Board Activity */}
              <Card className="border border-[#dce3d7] rounded-2xl shadow-sm bg-white overflow-hidden flex-1 flex flex-col">
                <CardHeader className="bg-[#fbfcf8] border-b border-[#e5eadf] py-4">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Tag className="w-4 h-4 text-[#316f8f]" />
                    Aktivne oglasne deske
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3 flex-1 overflow-y-auto max-h-[280px]">
                  {userBoards.map((tour) => (
                    <Link key={tour.boardId} to={`/board/${tour.boardId}`} className="block p-3 rounded-xl border border-[#e5eadf] hover:border-[#316f8f] hover:bg-slate-50 transition-all">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-semibold text-sm text-[#17231b]">{tour.mountainName}</span>
                        <span className="text-[10px] bg-[#f0f4ea] text-[#2f6b4f] px-2 py-0.5 rounded-md font-medium">D{tour.difficulty}</span>
                      </div>
                      <p className="text-[11px] text-[#647067] line-clamp-1">{tour.description}</p>
                    </Link>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Posts */}
              <Card className="border border-[#dce3d7] rounded-2xl shadow-sm bg-white overflow-hidden flex-1 flex flex-col">
                <CardHeader className="bg-[#fbfcf8] border-b border-[#e5eadf] py-4">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#c7792b]" />
                    Zadnje objave
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3 flex-1 overflow-y-auto max-h-[280px]">
                  {userPosts.length === 0 ? (
                    <p className="text-xs text-[#647067] italic text-center py-4">Ni objav.</p>
                  ) : (
                    userPosts.map((post) => (
                      <Link key={post.id} to={`/chat/${post.id}`} className="group block border-b border-[#f0f4ea] last:border-0 pb-2">
                        <p className="text-xs font-medium text-[#17231b] group-hover:text-[#2f6b4f] transition-colors line-clamp-1">{post.tagline}</p>
                        <p className="text-[10px] text-[#a1aca3] mt-0.5">{post.mountainName} • {formatDate(post.timeStamp)}</p>
                      </Link>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

// Old Style
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-cyan-50/40 px-3 py-6 dark:from-slate-950 dark:via-slate-950 dark:to-cyan-950/20 sm:px-6 sm:py-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 sm:gap-8">
        
        {/* HEADER */}
        <Card className="overflow-hidden border-0 bg-transparent shadow-none">
          <CardContent className="p-0">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-950 via-cyan-950 to-cyan-900 p-5 shadow-xl sm:rounded-3xl sm:p-8">
              <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-2xl font-bold tracking-tight text-white sm:text-4xl">
                      @{user.username}
                    </h1>
                    <Badge className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] uppercase tracking-wide text-white backdrop-blur sm:text-xs">
                      {derivedLevel}
                    </Badge>
                  </div>
                  <p className="max-w-2xl text-xs text-cyan-50/80 sm:text-sm">
                    User profile and activity overview.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
          {/* ACHIEVEMENTS */}
          <Card className="border border-slate-200/70 bg-white/85 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className="text-lg sm:text-xl">Verified achievements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 px-4 sm:px-6">
              {userScans.length === 0 && (
                <p className="text-sm text-slate-500">Uporabnik še nima verificiranih dosežkov.</p>
              )}
              {userScans.map((achievement, index) => (
                <div key={String(achievement.scanId)}>
                  <div className="flex flex-col gap-3 rounded-xl border p-3 sm:rounded-2xl sm:p-4">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-xs font-bold sm:h-11 sm:w-11 sm:rounded-xl sm:text-sm">
                        #{index + 1}
                      </div>
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="truncate text-sm font-semibold sm:text-base">
                            {achievement.mountainName}
                          </h3>
                          <Badge variant="outline" className="text-[10px] sm:text-xs">
                            {achievement.mountainHeight} m
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-500">
                          Verified: {formatDate(achievement.verifiedAt)}
                        </p>
                      </div>
                    </div>
                    <Badge className="w-fit text-[10px]">Verified</Badge>
                  </div>
                  {index < userScans.length - 1 && <Separator className="my-4" />}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* SIDEBAR */}
          <div className="space-y-6">
            <Card className="border-slate-200/70 bg-white/85 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
              <CardHeader className="px-4 sm:px-6">
                <CardTitle className="text-lg">Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 px-4 text-sm sm:px-6">
                <SummaryRow label="Last ascent" value={lastAchievement ? lastAchievement.mountainName : "-"} />
                <SummaryRow label="Most climbed" value={mostClimbed ? `${mostClimbed.name}` : "-"} />
                <SummaryRow label="Level" value={derivedLevel} />
                <SummaryRow label="Posts" value={String(userPosts.length)} />
              </CardContent>
            </Card>

            <Card className="border-slate-200/70 bg-white/85 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
              <CardHeader className="px-4 sm:px-6">
                <CardTitle className="text-lg">Board activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 px-4 sm:px-6">
                <div className="grid grid-cols-2 gap-3">
                  <MiniStat label="Boards" value={String(userBoards.length)} />
                  <MiniStat label="Avg diff" value={averageDifficulty} />
                </div>
                <div className="space-y-3">
                  {userBoards.map((tour) => (
                    <Link
                      key={tour.boardId}
                      to={`/board/${tour.boardId}`}
                      className="block rounded-xl border p-3 transition hover:bg-slate-50 dark:hover:bg-slate-800/60"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-medium">{tour.mountainName}</p>
                        <Badge variant="outline" className="text-[10px] shrink-0">Difficulty: {tour.difficulty}</Badge>
                      </div>
                      <p className="mt-1 text-[11px] text-slate-500">{tour.tourTime}h · {formatDate(tour.expiryDate)}</p>
                      <p className="mt-2 line-clamp-2 text-xs text-slate-600">{tour.description}</p>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200/70 bg-white/85 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
              <CardHeader className="px-4 sm:px-6">
                <CardTitle className="text-lg">Recent posts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 px-4 sm:px-6">
                {userPosts.length === 0 && (
                  <p className="text-sm text-slate-500">Uporabnik še nima objav.</p>
                )}

                {userPosts.map((post) => (
                  <Link
                    key={post.id}
                    to={`/chat/${post.id}`}
                    className="block rounded-xl border p-3 transition hover:bg-slate-50 dark:hover:bg-slate-800/60"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-medium">{post.tagline}</p>
                      <Badge variant="outline" className="text-[10px] shrink-0">
                        {post.commentCount} comments
                      </Badge>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-500">
                      {post.mountainName} · {formatDate(post.timeStamp)}
                    </p>
                    <p className="mt-2 line-clamp-2 text-xs text-slate-600">
                      {post.startMsg}
                    </p>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatsCardNew({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <Card className="border border-[#dce3d7] rounded-xl shadow-sm bg-white">
      <CardContent className="p-4 flex flex-col items-center justify-center text-center">
        <div className="p-2 rounded-lg bg-[#f0f4ea] text-[#2f6b4f] mb-2">
          {icon}
        </div>
        <p className="text-[10px] uppercase tracking-wider text-[#647067] font-semibold">{title}</p>
        <p className="text-xl font-bold text-[#17231b] mt-0.5">{value}</p>
      </CardContent>
    </Card>
  )
}

function StatsCard({ title, value, subtitle }: { title: string; value: string; subtitle: string }) {
  return (
    <Card className="border-slate-200/70 bg-white/85 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
      <CardContent className="p-4 sm:p-6">
        <p className="text-[9px] uppercase tracking-wider text-slate-500 sm:text-xs">{title}</p>
        <div className="mt-1 truncate text-lg font-bold sm:mt-3 sm:text-3xl">{value}</div>
        <p className="mt-1 line-clamp-1 text-[10px] text-slate-600 sm:text-sm">{subtitle}</p>
      </CardContent>
    </Card>
  )
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-white/50 p-3 dark:bg-slate-800/50">
      <p className="text-[10px] uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-bold">{value}</p>
    </div>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0 dark:border-slate-800">
      <span className="text-slate-500 text-xs sm:text-sm">{label}</span>
      <span className="max-w-[60%] truncate text-right font-medium text-xs sm:text-sm">{value}</span>
    </div>
  )
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("sl-SI", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function getExperienceLevel(totalSummits: number) {
  if (totalSummits >= 20) return "Expert"
  if (totalSummits >= 10) return "Advanced"
  if (totalSummits >= 5) return "Intermediate"
  return "Beginner"
}

export default UserProfilePage