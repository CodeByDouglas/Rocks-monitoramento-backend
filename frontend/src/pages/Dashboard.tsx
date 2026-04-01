import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Server, LogOut, RefreshCw } from 'lucide-react';
import MachineMetrics from '../components/MachineMetrics';

interface Machine {
    id: number;
    mac_address: string;
    name: string;
    type: string;
}

export default function Dashboard() {
    const [machines, setMachines] = useState<Machine[]>([]);
    const [selectedMachine, setSelectedMachine] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchMachines = async () => {
        console.log("Fetching machines...");
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.log("No token found, redirecting to login");
                navigate('/login');
                return;
            }

            const response = await axios.get('http://localhost:8000/api/machines', {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("Machines fetched:", response.data);
            setMachines(response.data);
            if (response.data.length > 0 && !selectedMachine) {
                setSelectedMachine(response.data[0].mac_address);
            }
            setLoading(false);
        } catch (error) {
            console.error("Error fetching machines", error);
            navigate('/login');
        }
    };

    useEffect(() => {
        console.log("Dashboard mounted");
        fetchMachines();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                color: 'white',
                fontSize: '1.5rem'
            }}>
                Loading dashboard...
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '2rem' }}>
            <header style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem',
                borderBottom: '1px solid var(--color-border)',
                paddingBottom: '1rem'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                        background: 'linear-gradient(135deg, var(--color-primary), #00c6ff)',
                        padding: '8px',
                        borderRadius: '8px',
                        boxShadow: '0 0 15px var(--color-primary-glow)'
                    }}>
                        <Server size={24} color="white" />
                    </div>
                    <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Rocks Dashboard</h1>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={fetchMachines} title="Refresh Machines">
                        <RefreshCw size={20} />
                    </button>
                    <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem' }}>
                <aside>
                    <h3 style={{ marginTop: 0, color: 'var(--color-text-dim)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Machines ({machines.length})
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {machines.map(machine => (
                            <div
                                key={machine.id}
                                onClick={() => setSelectedMachine(machine.mac_address)}
                                className="card"
                                style={{
                                    padding: '1rem',
                                    cursor: 'pointer',
                                    borderColor: selectedMachine === machine.mac_address ? 'var(--color-primary)' : 'transparent',
                                    background: selectedMachine === machine.mac_address ? 'rgba(0, 112, 243, 0.1)' : 'var(--color-surface)',
                                    textAlign: 'left'
                                }}
                            >
                                <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{machine.name || 'Unknown'}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)', fontFamily: 'monospace' }}>
                                    {machine.mac_address}
                                </div>
                                <div style={{
                                    fontSize: '0.7rem',
                                    marginTop: '0.5rem',
                                    display: 'inline-block',
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                    background: '#333'
                                }}>
                                    {machine.type}
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>

                <main>
                    {selectedMachine ? (
                        <>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h2 style={{ margin: 0 }}>
                                    {machines.find(m => m.mac_address === selectedMachine)?.name}
                                </h2>
                                <span style={{ color: 'var(--color-text-dim)', fontSize: '0.9rem' }}>
                                    Live Metrics
                                </span>
                            </div>
                            <MachineMetrics mac={selectedMachine} />
                        </>
                    ) : (
                        <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-dim)' }}>
                            Select a machine to view metrics
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
