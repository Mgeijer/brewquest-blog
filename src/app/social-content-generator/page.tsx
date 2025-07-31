'use client';

import { useState } from 'react';

interface ContentPack {
  weekNumber: number;
  state: string;
  weeklyPosts: {
    instagram: { caption: string; characterCount: number; hashtags: string[] };
    twitter: { text: string; characterCount: number; hashtags: string[] };
    facebook: { text: string; characterCount: number; engagementQuestion: string };
    linkedin: { text: string; characterCount: number; businessFocus: string };
  };
  dailyPosts: any;
  postingSchedule: any;
}

export default function SocialContentGeneratorPage() {
  const [weekNumber, setWeekNumber] = useState(1);
  const [stateName, setStateName] = useState('Alabama');
  const [isGenerating, setIsGenerating] = useState(false);
  const [contentPack, setContentPack] = useState<ContentPack | null>(null);
  const [formattedOutput, setFormattedOutput] = useState('');
  const [error, setError] = useState('');

  const generateContent = async () => {
    setIsGenerating(true);
    setError('');
    
    try {
      const response = await fetch('/api/generate-social-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          weekNumber,
          stateName,
          config: {
            tone: 'enthusiastic',
            focus: 'brewery_spotlight',
            includeBrandMentions: true,
            maxHashtags: {
              instagram: 30,
              twitter: 4
            }
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate content');
      }

      const result = await response.json();
      setContentPack(result.data.contentPack);
      setFormattedOutput(result.data.formattedOutput);
      
    } catch (err) {
      setError('Failed to generate content. Please try again.');
      console.error('Error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, platform: string) => {
    navigator.clipboard.writeText(text);
    alert(`${platform} content copied to clipboard!`);
  };

  const downloadMarkdown = () => {
    const blob = new Blob([formattedOutput], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `week-${weekNumber}-${stateName.toLowerCase()}-social-content.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              🍺 BrewQuest Chronicles Social Media Content Generator
            </h1>
            <p className="text-gray-600">
              Generate copy-paste ready social media content matching your existing format
            </p>
          </div>

          {/* Input Form */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="weekNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Week Number (1-52)
                </label>
                <input
                  type="number"
                  id="weekNumber"
                  min="1"
                  max="52"
                  value={weekNumber}
                  onChange={(e) => setWeekNumber(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="stateName" className="block text-sm font-medium text-gray-700 mb-2">
                  State Name
                </label>
                <input
                  type="text"
                  id="stateName"
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <button
              onClick={generateContent}
              disabled={isGenerating}
              className="mt-6 w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isGenerating ? '🍺 Generating Content...' : '🚀 Generate Social Media Content'}
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Generated Content */}
          {contentPack && (
            <div className="space-y-8">
              {/* Quick Stats */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h2 className="text-xl font-bold text-green-800 mb-4">✅ Content Generated Successfully!</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-bold text-lg text-green-600">{contentPack.weeklyPosts.instagram.characterCount}</div>
                    <div className="text-gray-600">Instagram chars</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg text-green-600">{contentPack.weeklyPosts.twitter.characterCount}</div>
                    <div className="text-gray-600">Twitter chars</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg text-green-600">{contentPack.weeklyPosts.facebook.characterCount}</div>
                    <div className="text-gray-600">Facebook chars</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg text-green-600">{contentPack.weeklyPosts.linkedin.characterCount}</div>
                    <div className="text-gray-600">LinkedIn chars</div>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={downloadMarkdown}
                    className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 font-medium"
                  >
                    📥 Download Complete Content Pack (.md)
                  </button>
                </div>
              </div>

              {/* Platform-specific Content */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Instagram */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-pink-600">📸 Instagram Post</h3>
                    <button
                      onClick={() => copyToClipboard(contentPack.weeklyPosts.instagram.caption, 'Instagram')}
                      className="bg-pink-600 text-white px-3 py-1 rounded text-sm hover:bg-pink-700"
                    >
                      Copy
                    </button>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md text-sm font-mono whitespace-pre-wrap max-h-64 overflow-y-auto">
                    {contentPack.weeklyPosts.instagram.caption}
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    {contentPack.weeklyPosts.instagram.characterCount} characters | {contentPack.weeklyPosts.instagram.hashtags.length} hashtags
                  </div>
                </div>

                {/* Twitter */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-blue-600">🐦 Twitter/X Post</h3>
                    <button
                      onClick={() => copyToClipboard(contentPack.weeklyPosts.twitter.text, 'Twitter')}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                    >
                      Copy
                    </button>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md text-sm font-mono whitespace-pre-wrap max-h-64 overflow-y-auto">
                    {contentPack.weeklyPosts.twitter.text}
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    {contentPack.weeklyPosts.twitter.characterCount} characters | {contentPack.weeklyPosts.twitter.hashtags.length} hashtags
                  </div>
                </div>

                {/* Facebook */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-blue-800">📘 Facebook Post</h3>
                    <button
                      onClick={() => copyToClipboard(contentPack.weeklyPosts.facebook.text, 'Facebook')}
                      className="bg-blue-800 text-white px-3 py-1 rounded text-sm hover:bg-blue-900"
                    >
                      Copy
                    </button>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md text-sm font-mono whitespace-pre-wrap max-h-64 overflow-y-auto">
                    {contentPack.weeklyPosts.facebook.text}
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    {contentPack.weeklyPosts.facebook.characterCount} characters
                  </div>
                </div>

                {/* LinkedIn */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-blue-700">💼 LinkedIn Post</h3>
                    <button
                      onClick={() => copyToClipboard(contentPack.weeklyPosts.linkedin.text, 'LinkedIn')}
                      className="bg-blue-700 text-white px-3 py-1 rounded text-sm hover:bg-blue-800"
                    >
                      Copy
                    </button>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md text-sm font-mono whitespace-pre-wrap max-h-64 overflow-y-auto">
                    {contentPack.weeklyPosts.linkedin.text}
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    {contentPack.weeklyPosts.linkedin.characterCount} characters | {contentPack.weeklyPosts.linkedin.businessFocus}
                  </div>
                </div>
              </div>

              {/* Posting Schedule */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-blue-800 mb-4">📅 Posting Schedule & Instructions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Best Posting Times:</h4>
                    <ul className="text-sm space-y-1">
                      <li><strong>Instagram:</strong> {contentPack.postingSchedule.bestTimes.instagram.join(', ')}</li>
                      <li><strong>Twitter:</strong> {contentPack.postingSchedule.bestTimes.twitter.join(', ')}</li>
                      <li><strong>Facebook:</strong> {contentPack.postingSchedule.bestTimes.facebook.join(', ')}</li>
                      <li><strong>LinkedIn:</strong> {contentPack.postingSchedule.bestTimes.linkedin.join(', ')}</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Usage Instructions:</h4>
                    <ul className="text-sm space-y-1">
                      {contentPack.postingSchedule.recommendations.map((rec, index) => (
                        <li key={index}>• {rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}