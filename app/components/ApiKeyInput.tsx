// app/components/ApiKeyInput.tsx
'use client';

interface ApiKeyInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function ApiKeyInput({ value, onChange }: ApiKeyInputProps) {
  return (
    <div className="bg-amber-100 rounded-2xl p-4 mb-5 border-2 border-amber-300">
      <div className="text-sm font-bold text-amber-900 mb-3">
        🔑 OpenAI API Key (Required)
      </div>
      <input
        type="password"
        className="w-full px-3 py-2.5 rounded-lg border-2 border-amber-300 text-xs font-mono bg-white focus:outline-none focus:border-amber-400"
        placeholder="sk-proj-..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="text-xs text-amber-900 mt-1.5 leading-relaxed">
        Get your key at:{' '}
        <a
          href="https://platform.openai.com/api-keys"
          target="_blank"
          rel="noreferrer"
          className="text-violet-600 font-bold no-underline hover:underline"
        >
          platform.openai.com/api-keys
        </a>
        <br />
        Costs ~$0.02 per plan. Saved in browser.
      </div>
    </div>
  );
}