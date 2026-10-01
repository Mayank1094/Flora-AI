import React, { useEffect, useState } from "react";
import { Shell, PageHeader } from "@/components/Shell";
import { statusColor } from "@/components/ScanResult";
import { initials } from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import api, { apiError } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users, ScanLine, ShieldCheck, BadgeCheck, Loader2, MapPin } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  Tooltip,
} from "recharts";
import { toast } from "sonner";

export default function Admin() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [scans, setScans] = useState([]);
  const [outbreaks, setOutbreaks] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const [s, u, sc, ob] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/admin/users"),
        api.get("/admin/scans"),
        api.get("/admin/outbreaks"),
      ]);
      setStats(s.data);
      setUsers(u.data.users);
      setScans(sc.data.scans);
      setOutbreaks(ob.data.outbreaks);
    } catch (e) {
      toast.error(apiError(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const setRole = async (id, role) => {
    try {
      await api.patch(`/admin/users/${id}/role`, { role });
      toast.success("Role updated.");
      setUsers((list) => list.map((x) => (x.id === id ? { ...x, role } : x)));
    } catch (e) {
      toast.error(apiError(e));
    }
  };

  const chartData = stats
    ? Object.entries(stats.scans_by_status)
        .filter(([, v]) => v > 0)
        .map(([name, value]) => ({ name, value }))
    : [];

  const barColor = (name) =>
    name === "Healthy" ? "hsl(103 51% 25%)" : name === "Unknown" ? "hsl(110 15% 55%)" : "hsl(14 63% 44%)";

  if (loading) {
    return (
      <Shell>
        <div className="flex justify-center py-32"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      </Shell>
    );
  }

  const cards = [
    { icon: Users, label: "Total users", value: stats.total_users },
    { icon: ShieldCheck, label: "Administrators", value: stats.total_admins },
    { icon: ScanLine, label: "Total scans", value: stats.total_scans },
    { icon: BadgeCheck, label: "Verified users", value: stats.verified_users },
  ];

  return (
    <Shell>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <PageHeader eyebrow="Control center" title="Admin dashboard" description="Monitor platform health, users and diagnostic activity." />

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" data-testid="admin-stats">
          {cards.map((c) => (
            <Card key={c.label} className="border-primary/15">
              <CardContent className="flex items-center gap-4 p-5">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary dark:text-accent">
                  <c.icon className="h-6 w-6" />
                </span>
                <div>
                  <p className="font-mono text-2xl font-bold text-foreground">{c.value}</p>
                  <p className="text-xs text-muted-foreground">{c.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {chartData.length > 0 && (
          <Card className="mt-6 border-primary/15">
            <CardHeader><CardTitle className="font-serif text-lg">Diagnoses by status</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip cursor={{ fill: "hsl(var(--secondary))" }} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {chartData.map((d) => <Cell key={d.name} fill={barColor(d.name)} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        <Card className="mt-6 border-primary/15" data-testid="admin-outbreaks">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif text-lg">
              <MapPin className="h-5 w-5 text-[hsl(14_63%_44%)]" /> Regional outbreak hotspots
            </CardTitle>
          </CardHeader>
          <CardContent>
            {outbreaks.length === 0 ? (
              <p className="text-sm text-muted-foreground">No regional scan data yet.</p>
            ) : (
              <div className="space-y-4">
                {outbreaks.map((o) => (
                  <div key={o.region} data-testid={`outbreak-${o.region}`}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1.5 font-medium text-foreground">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground" /> {o.region}
                      </span>
                      <span className="font-mono text-xs text-muted-foreground">
                        {o.unhealthy}/{o.total} affected{o.top_status ? ` · ${o.top_status}` : ""}
                      </span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${o.severity}%`,
                          background:
                            o.severity >= 66
                              ? "hsl(14 63% 44%)"
                              : o.severity >= 33
                              ? "hsl(38 78% 50%)"
                              : "hsl(103 51% 30%)",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Tabs defaultValue="users" className="mt-8">
          <TabsList data-testid="admin-tabs">
            <TabsTrigger value="users" data-testid="admin-tab-users">Users ({users.length})</TabsTrigger>
            <TabsTrigger value="scans" data-testid="admin-tab-scans">Scan logs ({scans.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card className="border-primary/15">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table data-testid="admin-users-table">
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Scans</TableHead>
                        <TableHead>Verified</TableHead>
                        <TableHead>Role</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((u) => (
                        <TableRow key={u.id} data-testid={`admin-user-row-${u.id}`}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8"><AvatarFallback className="bg-primary text-xs text-accent">{initials(u.name)}</AvatarFallback></Avatar>
                              <span className="font-medium">{u.name}</span>
                              {u.status === "deleted" && <Badge variant="secondary" className="text-[10px]">deleted</Badge>}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{u.email}</TableCell>
                          <TableCell className="font-mono text-sm">{u.scan_count}</TableCell>
                          <TableCell>
                            {u.email_verified ? <BadgeCheck className="h-4 w-4 text-primary" /> : <span className="text-xs text-muted-foreground">—</span>}
                          </TableCell>
                          <TableCell>
                            <Select value={u.role} onValueChange={(v) => setRole(u.id, v)} disabled={u.id === user.id}>
                              <SelectTrigger className="h-8 w-28" data-testid={`role-select-${u.id}`}><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="user">User</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scans">
            <Card className="border-primary/15">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table data-testid="admin-scans-table">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Plant</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {scans.map((s) => (
                        <TableRow key={s.id}>
                          <TableCell className="font-medium">{s.plant_name || "Plant"}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{s.user_email}</TableCell>
                          <TableCell><Badge className={`rounded-full border ${statusColor(s.status)}`}>{s.status}</Badge></TableCell>
                          <TableCell className="font-mono text-sm">{s.health_score}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{new Date(s.created_at).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Shell>
  );
}
