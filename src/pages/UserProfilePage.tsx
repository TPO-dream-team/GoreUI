import { useMemo } from "react"
import { useParams } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

type UserRecord = {
  id: string
  username: string
}

type UserScanDto = {
  id: number
  userId: string
  mountainId: string
}

type MountainDto = {
  id: string
  name: string
  height: number
  lat: number
  lon: number
}

type BoardListDto = {
  boardId: string
  expiryDate: string
  username: string
  userId: string
  mountainId: string
  description: string
  tourTime: number
  difficulty: number
}

type PostListDtoMock = {
  id: number
  tagline: string
  username: string
  userId: string
  mountainName: string
  commentCount: number
}

const mockUsers: UserRecord[] = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    username: "opica123",
  },
]

const mockMountains: MountainDto[] = [
  {
    id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    name: "Grintovec",
    height: 2558,
    lat: 46.3626,
    lon: 14.5358,
  },
  {
    id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
    name: "Triglav",
    height: 2864,
    lat: 46.3783,
    lon: 13.8369,
  },
  {
    id: "cccccccc-cccc-cccc-cccc-cccccccccccc",
    name: "Storžič",
    height: 2132,
    lat: 46.3362,
    lon: 14.4006,
  },
  {
    id: "dddddddd-dddd-dddd-dddd-dddddddddddd",
    name: "Viševnik",
    height: 2050,
    lat: 46.3772,
    lon: 13.9336,
  },
  {
    id: "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee",
    name: "Šmarna gora",
    height: 669,
    lat: 46.1299,
    lon: 14.4695,
  },
]

const mockScans: UserScanDto[] = [
  { id: 101, userId: "11111111-1111-1111-1111-111111111111", mountainId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa" },
  { id: 102, userId: "11111111-1111-1111-1111-111111111111", mountainId: "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee" },
  { id: 103, userId: "11111111-1111-1111-1111-111111111111", mountainId: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb" },
  { id: 104, userId: "11111111-1111-1111-1111-111111111111", mountainId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa" },
  { id: 105, userId: "11111111-1111-1111-1111-111111111111", mountainId: "cccccccc-cccc-cccc-cccc-cccccccccccc" },
]

const mockBoards: BoardListDto[] = [
  {
    boardId: "f1111111-1111-1111-1111-111111111111",
    expiryDate: "2026-04-10",
    username: "opica123",
    userId: "11111111-1111-1111-1111-111111111111",
    mountainId: "dddddddd-dddd-dddd-dddd-dddddddddddd",
    description: "Sobota zjutraj, zmeren tempo, izhodišče Rudno polje.",
    tourTime: 5,
    difficulty: 2,
  },
  {
    boardId: "f2222222-2222-2222-2222-222222222222",
    expiryDate: "2026-04-14",
    username: "opica123",
    userId: "11111111-1111-1111-1111-111111111111",
    mountainId: "cccccccc-cccc-cccc-cccc-cccccccccccc",
    description: "Iščem 2-3 sotrpina za vzpon, odhod zgodaj.",
    tourTime: 6,
    difficulty: 3,
  },
]

const mockPosts: PostListDtoMock[] = [
  {
    id: 2,
    tagline: "Grintovec v popolnih razmerah.",
    username: "opica123",
    userId: "11111111-1111-1111-1111-111111111111",
    mountainName: "Grintovec",
    commentCount: 3,
  },
  {
    id: 3,
    tagline: "Šmarna za quick hike po službi - mnenje?.",
    username: "opica123",
    userId: "11111111-1111-1111-1111-111111111111",
    mountainName: "Šmarna gora",
    commentCount: 2,
  },
]

const mockScanVerifiedAtByScanId: Record<number, string> = {
  101: "2026-03-28T08:35:00",
  102: "2026-03-21T10:20:00",
  103: "2025-09-12T06:55:00",
  104: "2025-08-03T07:10:00",
  105: "2025-07-14T09:05:00",
  106: "2026-03-18T09:15:00",
  107: "2026-03-05T17:40:00",
}

function UserProfilePage() {
  const { userId } = useParams<{ userId: string }>()

  const user =
    mockUsers.find((u) => u.id === userId) ??
    mockUsers[0]

  const userScans = useMemo(() => {
    return mockScans
      .filter((scan) => scan.userId === user.id)
      .map((scan) => {
        const mountain = mockMountains.find((m) => m.id === scan.mountainId)

        return {
          scanId: scan.id,
          mountainId: scan.mountainId,
          mountainName: mountain?.name ?? "Unknown mountain",
          mountainHeight: mountain?.height ?? 0,
          verifiedAt: mockScanVerifiedAtByScanId[scan.id] ?? "2026-01-01T00:00:00",
          difficulty: deriveDifficulty(mountain?.height ?? 0),
        }
      })
      .sort(
        (a, b) =>
          new Date(b.verifiedAt).getTime() - new Date(a.verifiedAt).getTime()
      )
  }, [user.id])

  const userBoards = useMemo(() => {
    return mockBoards
      .filter((board) => board.userId === user.id)
      .map((board) => {
        const mountain = mockMountains.find((m) => m.id === board.mountainId)

        return {
          ...board,
          mountainName: mountain?.name ?? "Unknown mountain",
        }
      })
      .sort(
        (a, b) =>
          new Date(b.expiryDate).getTime() - new Date(a.expiryDate).getTime()
      )
  }, [user.id])

  const userPosts = useMemo(() => {
    return mockPosts.filter((post) => post.userId === user.id)
  }, [user.id])

  const totalSummits = userScans.length

  const uniqueSummits = useMemo(() => {
    return new Set(userScans.map((a) => a.mountainId)).size
  }, [userScans])

  const lastAchievement = userScans[0] ?? null

  const highestPeak = useMemo(() => {
    return [...userScans].sort((a, b) => b.mountainHeight - a.mountainHeight)[0] ?? null
  }, [userScans])

  const mostClimbed = useMemo(() => {
    const counts = userScans.reduce<Record<string, { name: string; count: number }>>(
      (acc, item) => {
        if (!acc[item.mountainId]) {
          acc[item.mountainId] = { name: item.mountainName, count: 0 }
        }
        acc[item.mountainId].count += 1
        return acc
      },
      {}
    )

    return Object.values(counts).sort((a, b) => b.count - a.count)[0] ?? null
  }, [userScans])

  const averageDifficulty = useMemo(() => {
    if (!userScans.length) return "0.0"
    const sum = userScans.reduce((acc, item) => acc + item.difficulty, 0)
    return (sum / userScans.length).toFixed(1)
  }, [userScans])

  const derivedLevel = getExperienceLevel(totalSummits)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-cyan-50/40 px-4 py-8 dark:from-slate-950 dark:via-slate-950 dark:to-cyan-950/20">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <Card className="overflow-hidden border-0 bg-transparent shadow-none">
          <CardContent className="p-0">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950 via-cyan-950 to-cyan-900 p-6 shadow-xl md:p-8">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(8,145,178,0.35),transparent_28%),radial-gradient(circle_at_left,rgba(34,211,238,0.16),transparent_22%)]" />
              <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                      @{user.username}
                    </h1>
                    <Badge className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs uppercase tracking-wide text-white backdrop-blur">
                      {derivedLevel}
                    </Badge>
                  </div>

                  <p className="max-w-2xl text-sm text-cyan-50/80">
                    User mountain profile, verified ascents and activity overview.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatsCard
            title="Total verified ascents"
            value={String(totalSummits)}
            subtitle="Vsi uspešno verificirani scan dosežki"
          />
          <StatsCard
            title="Unique peaks reached"
            value={String(uniqueSummits)}
            subtitle="Število različnih osvojenih vrhov"
          />
          <StatsCard
            title="Boards created"
            value={String(userBoards.length)}
            subtitle="Aktivni boardi, ki jih je objavil uporabnik"
          />
          <StatsCard
            title="Highest verified peak"
            value={highestPeak ? highestPeak.mountainName : "-"}
            subtitle={highestPeak ? `${highestPeak.mountainHeight} m` : "Ni podatka"}
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
          <Card className="border border-slate-200/70 bg-white/85 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
            <CardHeader className="border-b border-slate-200/70 pb-4 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <span className="h-6 w-1 rounded-full bg-gradient-to-b from-cyan-700 to-cyan-400" />
                <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white">
                  Verified achievements
                </CardTitle>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 p-6">
              {userScans.length === 0 && (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Uporabnik še nima verificiranih dosežkov.
                </p>
              )}

              {userScans.map((achievement, index) => (
                <div key={achievement.scanId}>
                  <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/70 bg-white/75 p-4 shadow-sm transition-all hover:border-cyan-300/70 hover:bg-cyan-50/40 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-cyan-700/50 dark:hover:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-100 bg-gradient-to-br from-white to-cyan-50 text-sm font-bold text-cyan-900 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-800 dark:text-cyan-300">
                        #{index + 1}
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                            {achievement.mountainName}
                          </h3>
                          <Badge
                            variant="outline"
                            className="rounded-full border-slate-300 bg-white/80 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                          >
                            {achievement.mountainHeight} m
                          </Badge>
                        </div>

                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Verified on {formatDate(achievement.verifiedAt)}
                        </p>
                      </div>
                    </div>

                    <Badge className="rounded-full border-0 bg-gradient-to-r from-cyan-950 to-cyan-800 px-3 py-1 text-white shadow-sm dark:from-cyan-800 dark:to-cyan-500">
                      Verified
                    </Badge>
                  </div>

                  {index < userScans.length - 1 && (
                    <Separator className="my-4 bg-slate-200/70 dark:bg-slate-800" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border border-slate-200/70 bg-white/85 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
              <CardHeader className="border-b border-slate-200/70 pb-4 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="h-6 w-1 rounded-full bg-gradient-to-b from-cyan-700 to-cyan-400" />
                  <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white">
                    User summary
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 p-6 text-sm">
                <SummaryRow
                  label="Last verified ascent"
                  value={
                    lastAchievement
                      ? `${lastAchievement.mountainName} · ${formatDate(lastAchievement.verifiedAt)}`
                      : "-"
                  }
                />
                <SummaryRow
                  label="Most climbed peak"
                  value={mostClimbed ? `${mostClimbed.name} (${mostClimbed.count}x)` : "-"}
                />
                <SummaryRow
                  label="Highest peak"
                  value={
                    highestPeak
                      ? `${highestPeak.mountainName} (${highestPeak.mountainHeight} m)`
                      : "-"
                  }
                />
                <SummaryRow
                  label="Experience level"
                  value={derivedLevel}
                />
                <SummaryRow
                  label="Posts published"
                  value={String(userPosts.length)}
                />
              </CardContent>
            </Card>

            <Card className="border border-slate-200/70 bg-white/85 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
              <CardHeader className="border-b border-slate-200/70 pb-4 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="h-6 w-1 rounded-full  bg-white/85 " />
                  <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white">
                    Board activity
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="grid grid-cols-2 gap-3">
                  <MiniStat label="Boards" value={String(userBoards.length)} />
                  <MiniStat label="Avg diff" value={averageDifficulty} />
                </div>

                <div className="space-y-3">
                  {userBoards.length === 0 && (
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Uporabnik trenutno nima aktivnih boardov.
                    </p>
                  )}

                  {userBoards.map((tour) => (
                    <div
                      key={tour.boardId}
                      className="rounded-xl border border-slate-200/70 bg-white/75 p-4 shadow-sm transition-all hover:border-cyan-300/70 hover:bg-cyan-50/40 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-cyan-700/50 dark:hover:bg-slate-900"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-medium text-slate-900 dark:text-white">
                          {tour.mountainName}
                        </p>
                        <Badge
                          variant="outline"
                          className="rounded-full border-cyan-200 bg-cyan-50 text-cyan-900 dark:border-cyan-700/40 dark:bg-cyan-950/30 dark:text-cyan-300"
                        >
                          difficulty: {tour.difficulty}/5
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Expires {formatDate(tour.expiryDate)} · {tour.tourTime} h
                      </p>
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        {tour.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200/70 bg-white/85 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
              <CardHeader className="border-b border-slate-200/70 pb-4 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="h-6 w-1 rounded-full bg-gradient-to-b from-cyan-700 to-cyan-400" />
                  <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white">
                    Recent posts
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 p-6">
                {userPosts.length === 0 && (
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Uporabnik še nima objav.
                  </p>
                )}

                {userPosts.map((post) => (
                  <div
                    key={post.id}
                    className="rounded-xl border border-slate-200/70 bg-white/75 p-4 shadow-sm transition-all hover:border-cyan-300/70 hover:bg-cyan-50/40 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-cyan-700/50 dark:hover:bg-slate-900"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium text-slate-900 dark:text-white">
                        {post.tagline}
                      </p>
                    </div>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {post.mountainName} · {post.commentCount} comments
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatsCard({
  title,
  value,
  subtitle,
}: {
  title: string
  value: string
  subtitle: string
}) {
  return (
    <Card className="overflow-hidden border border-slate-200/70 bg-white/85 shadow-sm backdrop-blur transition-all hover:-translate-y-0.5 hover:border-cyan-300/70 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/70 dark:hover:border-cyan-700/50">
      <CardContent className="p-6">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          {title}
        </p>
        <div className="mt-3 bg-gradient-to-r from-cyan-950 via-cyan-900 to-cyan-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent dark:from-cyan-200 dark:via-cyan-300 dark:to-cyan-400">
          {value}
        </div>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          {subtitle}
        </p>
      </CardContent>
    </Card>
  )
}

function MiniStat({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl border border-slate-200/70 bg-gradient-to-br from-white to-cyan-50/60 p-4 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:to-cyan-950/20">
      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
        {value}
      </p>
    </div>
  )
}

function SummaryRow({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-200/70 pb-3 last:border-b-0 last:pb-0 dark:border-slate-800">
      <span className="text-slate-500 dark:text-slate-400">{label}</span>
      <span className="max-w-[55%] text-right font-medium text-slate-900 dark:text-white">
        {value}
      </span>
    </div>
  )
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("sl-SI", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function deriveDifficulty(height: number) {
  if (height >= 2500) return 5
  if (height >= 2000) return 4
  if (height >= 1500) return 3
  if (height >= 800) return 2
  return 1
}

function getExperienceLevel(totalSummits: number) {
  if (totalSummits >= 20) return "Expert"
  if (totalSummits >= 10) return "Advanced"
  if (totalSummits >= 5) return "Intermediate"
  return "Beginner"
}

export default UserProfilePage