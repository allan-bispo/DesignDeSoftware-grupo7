import { useState, useEffect } from 'react';
import { Mail, Save, Send, AlertCircle, CheckCircle2, Eye, EyeOff, Loader } from 'lucide-react';
import Header from '../components/Header';
import { emailService, EmailSettings as EmailSettingsType, UpdateEmailSettingsData, SendTestEmailData } from '../services/api/emailService';

export default function EmailSettings() {
  const [settings, setSettings] = useState<EmailSettingsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showKeys, setShowKeys] = useState({
    accessKey: false,
    secretKey: false,
  });

  const [formData, setFormData] = useState<UpdateEmailSettingsData>({
    awsAccessKeyId: '',
    awsSecretAccessKey: '',
    awsRegion: 'us-east-1',
    senderEmail: '',
    senderName: '',
    isEnabled: false,
  });

  const [testEmailData, setTestEmailData] = useState<SendTestEmailData>({
    recipientEmail: '',
    subject: 'Email de Teste - AKCIT',
    body: 'Este é um email de teste enviado pelo sistema AKCIT.\n\nSe você recebeu este email, significa que a configuração do AWS SES está funcionando corretamente!',
  });

  const awsRegions = [
    { value: 'us-east-1', label: 'US East (N. Virginia)' },
    { value: 'us-east-2', label: 'US East (Ohio)' },
    { value: 'us-west-1', label: 'US West (N. California)' },
    { value: 'us-west-2', label: 'US West (Oregon)' },
    { value: 'eu-west-1', label: 'Europe (Ireland)' },
    { value: 'eu-central-1', label: 'Europe (Frankfurt)' },
    { value: 'ap-south-1', label: 'Asia Pacific (Mumbai)' },
    { value: 'ap-southeast-1', label: 'Asia Pacific (Singapore)' },
    { value: 'sa-east-1', label: 'South America (São Paulo)' },
  ];

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await emailService.getSettings();
      setSettings(response.data);

      // Preenche o formulário com os dados existentes
      setFormData({
        awsAccessKeyId: response.data.awsAccessKeyId || '',
        awsSecretAccessKey: response.data.awsSecretAccessKey || '',
        awsRegion: response.data.awsRegion || 'us-east-1',
        senderEmail: response.data.senderEmail || '',
        senderName: response.data.senderName || '',
        isEnabled: response.data.isEnabled,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar configurações');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      setError(null);
      setSuccessMessage(null);

      const response = await emailService.updateSettings(formData);
      setSettings(response.data);
      setSuccessMessage('Configurações salvas com sucesso!');

      // Limpa mensagem após 3 segundos
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao salvar configurações');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSendingTest(true);
      setError(null);
      setSuccessMessage(null);

      const response = await emailService.sendTestEmail(testEmailData);
      setSuccessMessage(response.data.message || 'Email de teste enviado com sucesso!');

      // Limpa o formulário de teste
      setTestEmailData({
        ...testEmailData,
        recipientEmail: '',
      });

      // Limpa mensagem após 5 segundos
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao enviar email de teste');
    } finally {
      setIsSendingTest(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
        <Header />
        <main className="p-8 max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <Loader className="animate-spin text-primary-600" size={40} />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
      <Header />

      <main className="p-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Mail className="text-primary-600" size={32} />
            Gerenciamento de Email
          </h1>
          <p className="text-gray-600">Configure o envio de emails via AWS SES (Simple Email Service)</p>
        </div>

        {/* Mensagens de Feedback */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 animate-fade-in">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3 animate-fade-in">
            <CheckCircle2 className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
            <p className="text-green-800">{successMessage}</p>
          </div>
        )}

        {/* Status Card */}
        <div className="card p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Status da Configuração</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <div className={`w-3 h-3 rounded-full ${settings?.isConfigured ? 'bg-green-500' : 'bg-gray-300'}`} />
              <div>
                <p className="text-sm text-gray-600">Configurado</p>
                <p className="font-semibold">{settings?.isConfigured ? 'Sim' : 'Não'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <div className={`w-3 h-3 rounded-full ${settings?.isEnabled ? 'bg-green-500' : 'bg-red-500'}`} />
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="font-semibold">{settings?.isEnabled ? 'Ativo' : 'Inativo'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <div className="w-3 h-3 rounded-full bg-primary-500" />
              <div>
                <p className="text-sm text-gray-600">Região AWS</p>
                <p className="font-semibold">{settings?.awsRegion || 'Não configurada'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Formulário de Configuração */}
        <form onSubmit={handleSaveSettings} className="card p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Configurações AWS SES</h2>

          <div className="space-y-6">
            {/* Access Key */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                AWS Access Key ID *
              </label>
              <div className="relative">
                <input
                  type={showKeys.accessKey ? 'text' : 'password'}
                  value={formData.awsAccessKeyId}
                  onChange={(e) => setFormData({ ...formData, awsAccessKeyId: e.target.value })}
                  className="input-field pr-10"
                  placeholder="AKIA..."
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowKeys({ ...showKeys, accessKey: !showKeys.accessKey })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showKeys.accessKey ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Secret Key */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                AWS Secret Access Key *
              </label>
              <div className="relative">
                <input
                  type={showKeys.secretKey ? 'text' : 'password'}
                  value={formData.awsSecretAccessKey}
                  onChange={(e) => setFormData({ ...formData, awsSecretAccessKey: e.target.value })}
                  className="input-field pr-10"
                  placeholder="••••••••••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowKeys({ ...showKeys, secretKey: !showKeys.secretKey })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showKeys.secretKey ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Região */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Região AWS *
              </label>
              <select
                value={formData.awsRegion}
                onChange={(e) => setFormData({ ...formData, awsRegion: e.target.value })}
                className="input-field"
                required
              >
                {awsRegions.map((region) => (
                  <option key={region.value} value={region.value}>
                    {region.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sender Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email do Remetente *
              </label>
              <input
                type="email"
                value={formData.senderEmail}
                onChange={(e) => setFormData({ ...formData, senderEmail: e.target.value })}
                className="input-field"
                placeholder="noreply@example.com"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Este email deve estar verificado no AWS SES
              </p>
            </div>

            {/* Sender Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Remetente
              </label>
              <input
                type="text"
                value={formData.senderName}
                onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                className="input-field"
                placeholder="AKCIT Sistema"
              />
            </div>

            {/* Toggle Ativo/Inativo */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Ativar serviço de email</p>
                <p className="text-sm text-gray-600">Habilita o envio de emails pelo sistema</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isEnabled}
                  onChange={(e) => setFormData({ ...formData, isEnabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>

          {/* Botão Salvar */}
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="btn-primary flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  Salvando...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Salvar Configurações
                </>
              )}
            </button>
          </div>
        </form>

        {/* Teste de Envio */}
        {settings?.isConfigured && settings?.isEnabled && (
          <form onSubmit={handleSendTestEmail} className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Enviar Email de Teste</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Destinatário *
                </label>
                <input
                  type="email"
                  value={testEmailData.recipientEmail}
                  onChange={(e) => setTestEmailData({ ...testEmailData, recipientEmail: e.target.value })}
                  className="input-field"
                  placeholder="destino@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assunto *
                </label>
                <input
                  type="text"
                  value={testEmailData.subject}
                  onChange={(e) => setTestEmailData({ ...testEmailData, subject: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensagem *
                </label>
                <textarea
                  value={testEmailData.body}
                  onChange={(e) => setTestEmailData({ ...testEmailData, body: e.target.value })}
                  className="input-field"
                  rows={6}
                  required
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={isSendingTest}
                className="btn-primary flex items-center gap-2"
              >
                {isSendingTest ? (
                  <>
                    <Loader className="animate-spin" size={20} />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Enviar Email de Teste
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Instruções */}
        <div className="card p-6 mt-6 bg-blue-50 border border-blue-100">
          <h3 className="font-semibold text-blue-900 mb-3">Instruções para configurar AWS SES</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
            <li>Acesse o console AWS e vá para o serviço SES (Simple Email Service)</li>
            <li>Verifique o email que será usado como remetente (Verified identities)</li>
            <li>Crie credenciais IAM com permissões para SES (AmazonSESFullAccess)</li>
            <li>Copie o Access Key ID e Secret Access Key</li>
            <li>Cole as credenciais nos campos acima e salve</li>
            <li>Envie um email de teste para verificar a configuração</li>
          </ol>
          <p className="text-sm text-blue-700 mt-4 font-medium">
            ⚠️ Importante: Mantenha suas credenciais AWS seguras e não compartilhe com terceiros.
          </p>
        </div>
      </main>
    </div>
  );
}
