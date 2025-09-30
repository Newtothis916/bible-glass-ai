import { useState } from 'react';

interface AIBibleGuideProps {
  question: string;
  context?: Array<{ role: string; content: string }>;
}

export default function AIBibleGuide({ question, context = [] }: AIBibleGuideProps) {
  const [response, setResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // This would be replaced with actual Lovable AI integration
      // For now, we'll use a placeholder that simulates the AI response
      const aiResponse = await fetch('/api/ai-bible-guide', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          context
        })
      });

      if (!aiResponse.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await aiResponse.json();
      setResponse(data.answer || data.response || 'No response received');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">AI Bible Guide</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="question" className="block text-sm font-medium mb-2">
            Your Question:
          </label>
          <textarea
            id="question"
            value={question}
            readOnly
            className="w-full p-3 border rounded-lg"
            rows={3}
          />
        </div>

        {context.length > 0 && (
          <div>
            <label className="block text-sm font-medium mb-2">Context:</label>
            <div className="bg-gray-100 p-3 rounded-lg">
              {context.map((msg, index) => (
                <div key={index} className="mb-2">
                  <strong>{msg.role}:</strong> {msg.content}
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          {isLoading ? 'Processing...' : 'Get AI Response'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          Error: {error}
        </div>
      )}

      {response && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-semibold mb-2">AI Response:</h3>
          <div className="whitespace-pre-wrap">{response}</div>
        </div>
      )}
    </div>
  );
}
