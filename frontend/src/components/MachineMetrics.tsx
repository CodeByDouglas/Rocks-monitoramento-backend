import { useEffect, useState } from 'react';
import axios from 'axios';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Activity, Cpu, HardDrive } from 'lucide-react';

interface MachineMetricsProps {
    mac: string;
}

interface MetricData {
    timestamp: string;
    cpu: number;
    memory: number;
    disk: number;
}

export default function MachineMetrics({ mac }: MachineMetricsProps) {
    const [data, setData] = useState<MetricData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:8000/api/metrics/${mac}?limit=20`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const formattedData = response.data.map((item: any) => {
                    const metrics = item.metrics;
                    return {
                        timestamp: new Date(item.timestamp).toLocaleTimeString(),
                        cpu: Number(metrics.cpu?.percentual_total ?? metrics.cpu ?? 0),
                        memory: Number(metrics.ram?.percentual ?? metrics.memory ?? 0),
                        disk: Number(metrics.disco?.percentual ?? metrics.disk?.usage ?? metrics.disk ?? 0)
                    };
                }).reverse();

                setData(formattedData);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching metrics", error);
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, [mac]);

    if (loading) return <div>Loading metrics...</div>;
    if (data.length === 0) return <div>No metrics available for this machine.</div>;

    const latest = data[data.length - 1];

    return (
        <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                <MetricCard title="CPU Usage" value={`${latest.cpu.toFixed(1)}%`} icon={<Cpu size={24} color="#0070f3" />} />
                <MetricCard title="Memory Usage" value={`${latest.memory.toFixed(1)}%`} icon={<Activity size={24} color="#00ff88" />} />
                <MetricCard title="Disk Usage" value={`${latest.disk.toFixed(1)}%`} icon={<HardDrive size={24} color="#ff0055" />} />
            </div>

            <div className="card" style={{ height: '400px', marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1rem', textAlign: 'left' }}>Real-time Performance</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0070f3" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#0070f3" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorMem" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#00ff88" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#00ff88" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="timestamp" stroke="#666" />
                        <YAxis stroke="#666" />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Area type="monotone" dataKey="cpu" stroke="#0070f3" fillOpacity={1} fill="url(#colorCpu)" name="CPU %" />
                        <Area type="monotone" dataKey="memory" stroke="#00ff88" fillOpacity={1} fill="url(#colorMem)" name="Memory %" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

function MetricCard({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) {
    return (
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '50%' }}>
                {icon}
            </div>
            <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--color-text-dim)' }}>{title}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{value}</div>
            </div>
        </div>
    );
}
