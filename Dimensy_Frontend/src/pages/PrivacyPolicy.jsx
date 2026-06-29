import React from 'react';
import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link to="/entrar" className="text-sm text-blue-600 hover:underline">← Voltar</Link>
          <div className="flex items-center gap-3 mt-4 mb-2">
            <span className="text-2xl font-bold text-blue-600">Dimensy</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Política de Privacidade</h1>
          <p className="text-gray-500 mt-2">Última atualização: junho de 2025</p>
        </div>

        <div className="card p-8 space-y-8 text-sm text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">1. Quem somos</h2>
            <p>
              A <strong>Dimensy</strong> é uma plataforma web destinada exclusivamente a prestadores de serviço.
              Nossa função é fornecer uma página personalizada e um formulário de contato que organiza as
              solicitações de clientes antes de chegarem ao WhatsApp do prestador.
            </p>
            <p className="mt-2">
              Para dúvidas sobre esta política, entre em contato pelo e-mail:{' '}
              <a href="mailto:privacidade@dimensy.com.br" className="text-blue-600 hover:underline">
                privacidade@dimensy.com.br
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">2. Quais dados coletamos</h2>
            <h3 className="font-medium text-gray-800 mb-2">2.1 Dados do prestador de serviço (usuário cadastrado)</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Nome completo</li>
              <li>Endereço de e-mail</li>
              <li>Informações da empresa (nome, logotipo, cores, descrição, horário de atendimento)</li>
              <li>Número de WhatsApp da empresa</li>
              <li>Dados de uso da plataforma (páginas acessadas, ações realizadas)</li>
            </ul>
            <h3 className="font-medium text-gray-800 mt-4 mb-2">2.2 Dados dos clientes finais (visitantes da página pública)</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Nome</li>
              <li>Número de WhatsApp</li>
              <li>Cidade</li>
              <li>Ramos e serviços de interesse</li>
              <li>Observação opcional (texto livre)</li>
            </ul>
            <p className="mt-3 text-gray-500">
              Os dados dos clientes finais são coletados exclusivamente para que o prestador possa entrar
              em contato. A Dimensy não utiliza esses dados para fins próprios de marketing.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">3. Como usamos os dados</h2>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-3 border border-gray-100 font-semibold text-gray-700">Dado</th>
                  <th className="text-left p-3 border border-gray-100 font-semibold text-gray-700">Finalidade</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['E-mail do prestador', 'Autenticação e comunicações da plataforma'],
                  ['Dados da empresa', 'Exibição na página pública personalizada'],
                  ['Dados do cliente final', 'Encaminhar a solicitação ao prestador responsável'],
                  ['Dados de uso', 'Melhoria contínua da plataforma'],
                ].map(([dado, finalidade]) => (
                  <tr key={dado}>
                    <td className="p-3 border border-gray-100">{dado}</td>
                    <td className="p-3 border border-gray-100 text-gray-600">{finalidade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">4. Compartilhamento de dados</h2>
            <p>
              A Dimensy <strong>não vende, aluga ou compartilha</strong> dados pessoais com terceiros para fins
              comerciais. Os dados podem ser compartilhados apenas com:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>Provedores de infraestrutura</strong> (Supabase, Render, Vercel) para funcionamento da plataforma, todos com políticas de privacidade próprias e adequadas à LGPD/GDPR;</li>
              <li><strong>Autoridades competentes</strong>, quando exigido por lei ou ordem judicial.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">5. Armazenamento e segurança</h2>
            <p>
              Os dados são armazenados em servidores seguros com criptografia em repouso e em trânsito (TLS/SSL).
              Utilizamos o Supabase como banco de dados, que segue padrões internacionais de segurança.
            </p>
            <p className="mt-2">
              O acesso ao painel do prestador é protegido por autenticação com senha. Recomendamos o uso
              de senhas fortes e únicas.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">6. Retenção de dados</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Dados da conta do prestador: mantidos enquanto a conta estiver ativa.</li>
              <li>Dados dos leads (clientes finais): mantidos por até 2 anos ou até que o prestador os exclua manualmente.</li>
              <li>Após o encerramento da conta: dados removidos em até 30 dias.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">7. Seus direitos (LGPD)</h2>
            <p>De acordo com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você tem direito a:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>Confirmação</strong> da existência de tratamento dos seus dados;</li>
              <li><strong>Acesso</strong> aos dados que temos sobre você;</li>
              <li><strong>Correção</strong> de dados incompletos, inexatos ou desatualizados;</li>
              <li><strong>Exclusão</strong> dos dados pessoais tratados com base em consentimento;</li>
              <li><strong>Portabilidade</strong> dos dados a outro fornecedor;</li>
              <li><strong>Revogação do consentimento</strong> a qualquer momento.</li>
            </ul>
            <p className="mt-3">
              Para exercer qualquer um desses direitos, envie um e-mail para{' '}
              <a href="mailto:privacidade@dimensy.com.br" className="text-blue-600 hover:underline">
                privacidade@dimensy.com.br
              </a>{' '}
              com o assunto "Direitos LGPD".
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">8. Cookies</h2>
            <p>
              A Dimensy utiliza apenas cookies estritamente necessários para manter a sessão do usuário
              autenticado. Não utilizamos cookies de rastreamento ou publicidade.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">9. Dados de menores</h2>
            <p>
              A plataforma é destinada exclusivamente a pessoas jurídicas e maiores de 18 anos.
              Não coletamos intencionalmente dados de menores de idade.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">10. Alterações nesta política</h2>
            <p>
              Podemos atualizar esta política periodicamente. Quando houver mudanças relevantes, notificaremos
              os prestadores cadastrados por e-mail. O uso continuado da plataforma após a notificação implica
              aceitação das novas condições.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">11. Contato</h2>
            <p>
              Encarregado de Proteção de Dados (DPO):{' '}
              <a href="mailto:privacidade@dimensy.com.br" className="text-blue-600 hover:underline">
                privacidade@dimensy.com.br
              </a>
            </p>
          </section>

        </div>

        <p className="text-center text-xs text-gray-300 mt-8">
          Dimensy — Todos os direitos reservados
        </p>
      </div>
    </div>
  );
}
