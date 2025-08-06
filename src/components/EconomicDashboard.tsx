
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from "recharts";
import { 
  TrendingDown, TrendingUp, Calendar, Trophy, 
  RotateCcw, DollarSign, Target
} from "lucide-react";
import { gameEconomyService, PlayerEconomicProfile } from "@/services/GameEconomyService";
import { useToast } from "@/hooks/use-toast";

interface EconomicDashboardProps {
  onClose: () => void;
}

const EconomicDashboard = ({ onClose }: EconomicDashboardProps) => {
  const [profile, setProfile] = useState<PlayerEconomicProfile>(
    gameEconomyService.loadPlayerProfile()
  );
  const [topLosers, setTopLosers] = useState(gameEconomyService.getTopLosers());
  const [topRecoveries, setTopRecoveries] = useState(gameEconomyService.getTopRecoveries());
  const { toast } = useToast();

  useEffect(() => {
    const interval = setInterval(() => {
      setProfile(gameEconomyService.loadPlayerProfile());
      setTopLosers(gameEconomyService.getTopLosers());
      setTopRecoveries(gameEconomyService.getTopRecoveries());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const cycleProgress = ((30 - profile.monthlyData.currentCycle) / 30) * 100;
  const estimatedReturn = profile.monthlyData.totalLoss * 0.5;

  // Preparar dados para gráficos
  const dailyChartData = profile.monthlyData.dailyData
    .slice(-14) // Últimos 14 dias
    .map(day => ({
      date: new Date(day.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      perdido: day.netLoss,
      apostado: day.totalBet,
      ganho: day.totalWon,
      taxa: day.dailyFee
    }));

  const monthlyOverview = {
    totalBet: profile.monthlyData.dailyData.reduce((sum, day) => sum + day.totalBet, 0),
    totalWon: profile.monthlyData.dailyData.reduce((sum, day) => sum + day.totalWon, 0),
    totalFees: profile.monthlyData.dailyData.reduce((sum, day) => sum + day.dailyFee, 0),
    totalLoss: profile.monthlyData.totalLoss
  };

  const pieData = [
    { name: 'Apostado', value: monthlyOverview.totalBet, color: '#8B5CF6' },
    { name: 'Ganho', value: monthlyOverview.totalWon, color: '#10B981' },
    { name: 'Taxas', value: monthlyOverview.totalFees, color: '#EF4444' },
  ];

  const handleResetCycle = () => {
    toast({
      title: "🔄 Simulação de Reset",
      description: `Retorno de ${estimatedReturn.toFixed(0)} fichas adicionado!`,
      className: "border-joker-gold",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-gradient-dark border-joker-purple casino-glow">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-joker-gold font-horror text-xl">
              📊 DASHBOARD ECONÔMICO
            </CardTitle>
            <Button variant="outline" onClick={onClose} className="text-xs">
              ✕ Fechar
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-dark border border-red-500">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <TrendingDown className="w-5 h-5 text-red-400" />
                  <div>
                    <p className="text-red-400 text-xs">Perdas do Mês</p>
                    <p className="text-red-400 font-bold text-lg">
                      {profile.monthlyData.totalLoss.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-dark border border-green-500">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-green-400 text-xs">Retorno Estimado</p>
                    <p className="text-green-400 font-bold text-lg">
                      {estimatedReturn.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-dark border border-joker-gold">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-joker-gold" />
                  <div>
                    <p className="text-joker-gold text-xs">Dias Restantes</p>
                    <p className="text-joker-gold font-bold text-lg">
                      {profile.monthlyData.currentCycle}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-dark border border-joker-purple">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-joker-purple" />
                  <div>
                    <p className="text-joker-purple text-xs">Taxa Retorno</p>
                    <p className="text-joker-purple font-bold text-lg">50%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Progresso do Ciclo */}
          <Card className="bg-gradient-dark border-joker-purple">
            <CardHeader>
              <CardTitle className="text-joker-gold text-sm">🔄 Progresso do Ciclo (30 dias)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Progress value={cycleProgress} className="h-3" />
                <div className="flex justify-between text-xs">
                  <span className="text-joker-purple">
                    Início: {profile.currentMonth}-01
                  </span>
                  <span className="text-joker-gold">
                    {cycleProgress.toFixed(1)}% concluído
                  </span>
                  <span className="text-green-400">
                    Retorno em {profile.monthlyData.currentCycle} dias
                  </span>
                </div>
                <Button 
                  variant="joker" 
                  onClick={handleResetCycle}
                  disabled={profile.monthlyData.currentCycle > 0}
                  className="w-full text-sm"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  {profile.monthlyData.currentCycle > 0 
                    ? `Aguardar ${profile.monthlyData.currentCycle} dias` 
                    : 'Receber Retorno Mensal'
                  }
                </Button>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="charts" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gradient-dark">
              <TabsTrigger value="charts">📈 Gráficos</TabsTrigger>
              <TabsTrigger value="rankings">🏆 Rankings</TabsTrigger>
              <TabsTrigger value="history">📋 Histórico</TabsTrigger>
            </TabsList>

            <TabsContent value="charts" className="space-y-4">
              {/* Gráfico de Barras Diário */}
              <Card className="bg-gradient-dark border-joker-purple">
                <CardHeader>
                  <CardTitle className="text-joker-gold text-sm">📊 Atividade Diária (Últimos 14 dias)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dailyChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#D1D5DB' }} />
                        <YAxis tick={{ fontSize: 12, fill: '#D1D5DB' }} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1F2937', 
                            border: '1px solid #8B5CF6',
                            borderRadius: '8px'
                          }} 
                        />
                        <Bar dataKey="apostado" fill="#8B5CF6" name="Apostado" />
                        <Bar dataKey="ganho" fill="#10B981" name="Ganho" />
                        <Bar dataKey="perdido" fill="#EF4444" name="Perdido" />
                        <Bar dataKey="taxa" fill="#F59E0B" name="Taxa" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Gráfico de Pizza */}
              <Card className="bg-gradient-dark border-joker-purple">
                <CardHeader>
                  <CardTitle className="text-joker-gold text-sm">🥧 Distribuição Mensal</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rankings" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Top Perdedores */}
                <Card className="bg-gradient-dark border-red-500">
                  <CardHeader>
                    <CardTitle className="text-red-400 text-sm flex items-center">
                      <TrendingDown className="w-4 h-4 mr-2" />
                      🔻 Maiores Perdedores
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {topLosers.slice(0, 5).map((player, index) => (
                        <div 
                          key={player.name}
                          className={`flex justify-between items-center p-2 rounded ${
                            player.name.includes('Você') ? 'bg-joker-purple/20 border border-joker-purple' : 'bg-gray-800'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <span className="text-xs bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center">
                              {index + 1}
                            </span>
                            <span className="text-sm text-joker-gold">{player.name}</span>
                          </div>
                          <span className="text-red-400 font-bold text-sm">
                            -{player.loss.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Top Recuperações */}
                <Card className="bg-gradient-dark border-green-500">
                  <CardHeader>
                    <CardTitle className="text-green-400 text-sm flex items-center">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      🔝 Maiores Recuperações
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {topRecoveries.slice(0, 5).map((player, index) => (
                        <div 
                          key={player.name}
                          className="flex justify-between items-center p-2 rounded bg-gray-800"
                        >
                          <div className="flex items-center space-x-2">
                            <span className="text-xs bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center">
                              {index + 1}
                            </span>
                            <span className="text-sm text-joker-gold">{player.name}</span>
                          </div>
                          <span className="text-green-400 font-bold text-sm">
                            +{player.recovery.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <Card className="bg-gradient-dark border-joker-purple">
                <CardHeader>
                  <CardTitle className="text-joker-gold text-sm">📋 Histórico Mensal</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {profile.historicalMonths.length > 0 ? (
                      profile.historicalMonths.slice(-6).map((month, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-800 rounded">
                          <div>
                            <p className="text-joker-gold font-bold">
                              Mês {profile.historicalMonths.length - index}
                            </p>
                            <p className="text-xs text-joker-purple">
                              {month.dailyData.length} dias ativos
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-red-400">
                              Perda: -{month.totalLoss.toFixed(0)}
                            </p>
                            <p className="text-green-400">
                              Retorno: +{month.totalReturn.toFixed(0)}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-joker-purple py-8">
                        📊 Primeiro mês de atividade
                        <br />
                        <span className="text-xs">Histórico será criado após 30 dias</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default EconomicDashboard;
