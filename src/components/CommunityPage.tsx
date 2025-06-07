
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

export function CommunityPage() {
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [newPost, setNewPost] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const languages = [
    { code: 'english', name: 'English', flag: '🇬🇧' },
    { code: 'hindi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'tamil', name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'telugu', name: 'తెలుగు', flag: '🇮🇳' },
    { code: 'marathi', name: 'मराठी', flag: '🇮🇳' },
    { code: 'bengali', name: 'বাংলা', flag: '🇮🇳' },
    { code: 'gujarati', name: 'ગુજરાતી', flag: '🇮🇳' },
    { code: 'kannada', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
    { code: 'malayalam', name: 'മലയാളം', flag: '🇮🇳' },
    { code: 'punjabi', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
    { code: 'spanish', name: 'Español', flag: '🇪🇸' },
    { code: 'french', name: 'Français', flag: '🇫🇷' },
    { code: 'german', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'chinese', name: '中文', flag: '🇨🇳' },
    { code: 'japanese', name: '日本語', flag: '🇯🇵' }
  ];

  const categories = [
    'General Questions',
    'Application Help',
    'Technical Issues',
    'Document Verification',
    'Payment Issues',
    'Feedback & Suggestions'
  ];

  const communityPosts = [
    {
      id: 1,
      user: 'राज पटेल',
      category: 'Application Help',
      title: 'How to apply for birth certificate online?',
      content: 'मुझे अपने बच्चे के लिए जन्म प्रमाणपत्र के लिए आवेदन करना है। कृपया मार्गदर्शन करें।',
      timestamp: '2 hours ago',
      replies: 3,
      language: 'hindi',
      solved: false
    },
    {
      id: 2,
      user: 'Priya Sharma',
      category: 'Technical Issues',
      title: 'Document upload not working',
      content: 'I am unable to upload my documents. The page keeps loading but nothing happens.',
      timestamp: '4 hours ago',
      replies: 5,
      language: 'english',
      solved: true
    },
    {
      id: 3,
      user: 'মোঃ রহিম',
      category: 'Document Verification',
      title: 'আধার কার্ড যাচাইকরণ সমস্যা',
      content: 'আমার আধার কার্ড যাচাইকরণে সমস্যা হচ্ছে। সিস্টেম বলছে নম্বরটি বৈধ নয়।',
      timestamp: '6 hours ago',
      replies: 2,
      language: 'bengali',
      solved: false
    }
  ];

  const handleTranslate = async (text: string, targetLang: string) => {
    // Simulate AI translation
    toast({
      title: "Translating...",
      description: `Converting text to ${languages.find(l => l.code === targetLang)?.name}`,
    });

    // Simulate translation delay
    setTimeout(() => {
      toast({
        title: "Translation Complete",
        description: "Text has been translated using AI language models",
      });
    }, 1500);
  };

  const handlePostSubmit = () => {
    if (!newPost || !selectedCategory) {
      toast({
        title: "Incomplete Post",
        description: "Please select a category and write your question",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Post Submitted",
      description: "Your question has been posted to the community",
    });

    setNewPost('');
    setSelectedCategory('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-yellow-400">Community Support</h2>
        <div className="flex items-center gap-4">
          <Badge className="bg-blue-600 text-white">Multilingual AI</Badge>
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="w-[180px] bg-gray-700 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code} className="text-white">
                  {lang.flag} {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* AI Chatbot Section */}
      <Card className="bg-gradient-to-r from-blue-900 to-purple-900 border-blue-700">
        <CardHeader>
          <CardTitle className="text-yellow-400">🤖 AI Assistant</CardTitle>
          <CardDescription className="text-gray-300">
            Get instant help with AI-powered responses in your preferred language
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-white mb-2">
                <strong>AI:</strong> Hello! I can help you with government services in {languages.find(l => l.code === selectedLanguage)?.name}. How can I assist you today?
              </p>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder={`Type your question in ${languages.find(l => l.code === selectedLanguage)?.name}...`}
                className="bg-gray-700 border-gray-600 text-white flex-1"
              />
              <Button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900">
                Ask AI
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create New Post */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-yellow-400">Ask the Community</CardTitle>
          <CardDescription className="text-gray-400">
            Post your question and get help from other users and experts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              {categories.map((category) => (
                <SelectItem key={category} value={category} className="text-white">
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            placeholder="Write your question or describe your issue..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            className="bg-gray-700 border-gray-600 text-white"
          />

          <div className="flex gap-2">
            <Button 
              onClick={handlePostSubmit}
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900"
            >
              Post Question
            </Button>
            <Button 
              variant="outline"
              className="border-gray-600 text-gray-300"
              onClick={() => handleTranslate(newPost, selectedLanguage)}
            >
              AI Translate
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Community Posts */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-yellow-400">Recent Discussions</CardTitle>
          <CardDescription className="text-gray-400">
            Browse questions and answers from the community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {communityPosts.map((post) => (
              <Card key={post.id} className="bg-gray-700 border-gray-600">
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                        <span className="text-gray-900 font-bold text-sm">
                          {post.user.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{post.user}</p>
                        <p className="text-gray-400 text-sm">{post.timestamp}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-blue-600">{post.category}</Badge>
                      {post.solved && <Badge className="bg-green-600">Solved</Badge>}
                      <Badge variant="outline" className="border-gray-500 text-gray-300">
                        {languages.find(l => l.code === post.language)?.flag}
                      </Badge>
                    </div>
                  </div>

                  <h4 className="text-white font-semibold mb-2">{post.title}</h4>
                  <p className="text-gray-300 mb-3">{post.content}</p>

                  <div className="flex justify-between items-center">
                    <p className="text-gray-400 text-sm">{post.replies} replies</p>
                    <div className="flex gap-2">
                      <Button 
                        size="sm"
                        variant="outline"
                        className="border-gray-600 text-gray-300"
                      >
                        Reply
                      </Button>
                      <Button 
                        size="sm"
                        variant="outline"
                        className="border-gray-600 text-gray-300"
                        onClick={() => handleTranslate(post.content, selectedLanguage)}
                      >
                        Translate
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Language Support Stats */}
      <Card className="bg-gradient-to-r from-green-900 to-teal-900 border-green-700">
        <CardHeader>
          <CardTitle className="text-yellow-400">🌍 Multilingual Support</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-white">{languages.length}</p>
              <p className="text-sm text-gray-300">Supported Languages</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">2,435</p>
              <p className="text-sm text-gray-300">Community Posts</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">87%</p>
              <p className="text-sm text-gray-300">Questions Resolved</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-400">24/7</p>
              <p className="text-sm text-gray-300">AI Support</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
