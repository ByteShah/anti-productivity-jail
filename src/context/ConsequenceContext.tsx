import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Consequence, ConsequenceType } from '../types/Consequence';

interface ConsequenceContextProps {
  consequences: Consequence[];
  addConsequence: (consequence: Omit<Consequence, 'id'>) => void;
  updateConsequence: (id: string, consequence: Partial<Consequence>) => void;
  deleteConsequence: (id: string) => void;
  getConsequence: (id: string) => Consequence | undefined;
  getConsequencesByType: (type: ConsequenceType) => Consequence[];
  triggerRandomConsequence: () => Consequence | null;
  executedConsequences: Consequence[];
  markConsequenceExecuted: (id: string) => void;
}

const ConsequenceContext = createContext<ConsequenceContextProps | undefined>(undefined);

export const useConsequenceContext = () => {
  const context = useContext(ConsequenceContext);
  if (!context) {
    throw new Error('useConsequenceContext must be used within a ConsequenceProvider');
  }
  return context;
};

interface ConsequenceProviderProps {
  children: ReactNode;
}

export const ConsequenceProvider = ({ children }: ConsequenceProviderProps) => {
  const [consequences, setConsequences] = useState<Consequence[]>(() => {
    const savedConsequences = localStorage.getItem('consequences');
    return savedConsequences 
      ? JSON.parse(savedConsequences) 
      : [
          {
            id: '1',
            type: ConsequenceType.SOCIAL,
            name: 'Tweet my failure',
            description: 'Post a tweet about failing my task',
            severity: 'medium',
            enabled: true,
            config: { message: 'I failed to complete my task. Time to face the consequences.' }
          },
          {
            id: '2',
            type: ConsequenceType.FINANCIAL,
            name: 'Donate $5',
            description: 'Donate $5 to a cause I dislike',
            severity: 'high',
            enabled: true,
            config: { amount: 5, recipient: 'Save the Mosquitoes Foundation' }
          }
        ];
  });

  const [executedConsequences, setExecutedConsequences] = useState<Consequence[]>(() => {
    const savedExecuted = localStorage.getItem('executedConsequences');
    return savedExecuted ? JSON.parse(savedExecuted) : [];
  });

  useEffect(() => {
    localStorage.setItem('consequences', JSON.stringify(consequences));
  }, [consequences]);

  useEffect(() => {
    localStorage.setItem('executedConsequences', JSON.stringify(executedConsequences));
  }, [executedConsequences]);

  const addConsequence = (consequenceData: Omit<Consequence, 'id'>) => {
    const newConsequence: Consequence = {
      id: Date.now().toString(),
      ...consequenceData,
    };
    setConsequences((prev) => [...prev, newConsequence]);
  };

  const updateConsequence = (id: string, consequenceData: Partial<Consequence>) => {
    setConsequences((prev) =>
      prev.map((consequence) =>
        consequence.id === id ? { ...consequence, ...consequenceData } : consequence
      )
    );
  };

  const deleteConsequence = (id: string) => {
    setConsequences((prev) => prev.filter((consequence) => consequence.id !== id));
  };

  const getConsequence = (id: string) => {
    return consequences.find((consequence) => consequence.id === id);
  };

  const getConsequencesByType = (type: ConsequenceType) => {
    return consequences.filter((consequence) => consequence.type === type && consequence.enabled);
  };

  const triggerRandomConsequence = () => {
    const enabledConsequences = consequences.filter((consequence) => consequence.enabled);
    if (enabledConsequences.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * enabledConsequences.length);
    const selectedConsequence = enabledConsequences[randomIndex];
    return selectedConsequence;
  };

  const markConsequenceExecuted = (id: string) => {
    const consequence = getConsequence(id);
    if (consequence) {
      const executedConsequence = {
        ...consequence,
        executedAt: new Date().toISOString(),
      };
      setExecutedConsequences((prev) => [...prev, executedConsequence]);
    }
  };

  return (
    <ConsequenceContext.Provider
      value={{
        consequences,
        addConsequence,
        updateConsequence,
        deleteConsequence,
        getConsequence,
        getConsequencesByType,
        triggerRandomConsequence,
        executedConsequences,
        markConsequenceExecuted,
      }}
    >
      {children}
    </ConsequenceContext.Provider>
  );
};