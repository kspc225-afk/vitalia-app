import React, { useState } from 'react';
import { useStore } from '../../services/store';
import { MessageSquare, Send, Stethoscope, ShieldCheck } from 'lucide-react';

export const PatientDoctorChat: React.FC = () => {
  const { currentUser, patients, doctors, messages, sendMessage } = useStore();

  const currentPatient =
    patients.find((p) => p.userId === currentUser.id) ||
    patients.find((p) => p.id === 'pat-1') ||
    patients[0];

  const assignedDoctor =
    doctors.find((d) => d.id === currentPatient.assignedDoctorId) || doctors[0];

  const [inputText, setInputText] = useState('');

  // Conversation messages
  const conversationMessages = messages.filter(
    (m) =>
      m.patientId === currentPatient.id ||
      (m.senderId === currentUser.id && m.receiverId === assignedDoctor.userId) ||
      (m.senderId === assignedDoctor.userId && m.receiverId === currentUser.id)
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    sendMessage(assignedDoctor.userId, currentPatient.id, inputText.trim());
    setInputText('');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Messagerie avec Mon Médecin
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Canal confidentiel direct pour vos questions thérapeutiques non urgentes.
        </p>
      </div>

      {/* Chat Box */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col min-h-[500px]">
        {/* Doctor Header Banner */}
        <div className="p-4 border-b border-slate-200 bg-teal-50/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full overflow-hidden bg-slate-200 border-2 border-teal-600/30 shrink-0">
              <img
                src={assignedDoctor.photoUrl}
                alt=""
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">
                Dr. {assignedDoctor.firstName} {assignedDoctor.lastName}
              </h4>
              <p className="text-xs text-teal-800 font-semibold">{assignedDoctor.specialtyName}</p>
            </div>
          </div>

          <div className="text-right hidden sm:block">
            <span className="text-[10px] font-semibold text-emerald-800 bg-white px-2.5 py-1 rounded-full border border-emerald-200 shadow-2xs">
              Échange Protégé OSIRIX
            </span>
          </div>
        </div>

        {/* Messages Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 max-h-[380px]">
          {conversationMessages.length === 0 ? (
            <div className="text-center py-12 text-xs text-slate-400">
              Aucun message pour l'instant. Vous pouvez poser une question médicale à votre médecin ci-dessous.
            </div>
          ) : (
            conversationMessages.map((msg) => {
              const isPatient = msg.senderId === currentUser.id || msg.senderRole === 'patient';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isPatient ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                      isPatient
                        ? 'bg-[#0a6b63] text-white rounded-br-none shadow-xs'
                        : 'bg-slate-100 text-slate-800 rounded-bl-none'
                    }`}
                  >
                    {msg.content}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono mt-1 px-1">
                    {new Date(msg.sentAt).toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-4 border-t border-slate-200 bg-slate-50 flex items-center gap-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Posez votre question médicale à votre médecin..."
            className="flex-1 p-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-[#0a6b63]"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <Send className="w-4 h-4 stroke-[2.5]" />
            <span>Envoyer</span>
          </button>
        </form>
      </div>

      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-500 text-center">
        En cas d'urgence médicale vitale, ne pas utiliser la messagerie en ligne : contactez immédiatement les Urgences d'OSIRIX au <strong>+225 27 22 00 11 22</strong> ou composez le SAMU (185).
      </div>
    </div>
  );
};
