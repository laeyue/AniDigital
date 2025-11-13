import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { diagnosesAPI } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Scan, Upload, Camera, AlertCircle, CheckCircle, History } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const CropDoctor = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [cropType, setCropType] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const queryClient = useQueryClient();

  const { data: diagnosesData } = useQuery({
    queryKey: ['diagnoses'],
    queryFn: () => diagnosesAPI.getAll()
  });

  const diagnoseMutation = useMutation({
    mutationFn: (formData: FormData) => diagnosesAPI.create(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diagnoses'] });
      toast({
        title: 'Diagnosis Complete',
        description: 'Your crop has been analyzed successfully.',
      });
      setSelectedFile(null);
      setPreview('');
      setCropType('');
      setSymptoms('');
    },
    onError: (error: any) => {
      toast({
        title: 'Diagnosis Failed',
        description: error.response?.data?.message || 'Failed to analyze crop',
        variant: 'destructive',
      });
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast({
        title: 'No image selected',
        description: 'Please select a crop image to analyze',
        variant: 'destructive',
      });
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('cropType', cropType);
    formData.append('symptoms', JSON.stringify(symptoms.split(',').map(s => s.trim()).filter(Boolean)));

    diagnoseMutation.mutate(formData);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">AI Crop Doctor</h1>
        <p className="text-muted-foreground mt-1">
          Upload a photo of your crop for instant AI-powered disease diagnosis
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upload Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Scan Your Crop
            </CardTitle>
            <CardDescription>Take or upload a clear photo of the affected plant</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cropType">Crop Type</Label>
                <Input
                  id="cropType"
                  placeholder="e.g., Rice, Corn, Tomato"
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="symptoms">Visible Symptoms (optional)</Label>
                <Textarea
                  id="symptoms"
                  placeholder="e.g., yellow leaves, brown spots, wilting"
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Crop Image</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="flex-1"
                  />
                  <Button type="button" variant="outline" size="icon">
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {preview && (
                <div className="border rounded-lg p-4">
                  <img src={preview} alt="Preview" className="w-full h-64 object-cover rounded" />
                </div>
              )}

              <Button type="submit" className="w-full" disabled={diagnoseMutation.isPending}>
                {diagnoseMutation.isPending ? (
                  <>
                    <Scan className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Scan className="mr-2 h-4 w-4" />
                    Diagnose Crop
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Recent Diagnoses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Recent Diagnoses
            </CardTitle>
            <CardDescription>Your previous crop health checks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {diagnosesData?.data?.diagnoses?.slice(0, 5).map((diagnosis: any) => (
                <div key={diagnosis._id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{diagnosis.cropType}</h4>
                        <Badge className={getSeverityColor(diagnosis.diagnosis.severity)}>
                          {diagnosis.diagnosis.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date(diagnosis.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {diagnosis.diagnosis.confidence && (
                      <span className="text-sm font-medium">
                        {diagnosis.diagnosis.confidence}% confident
                      </span>
                    )}
                  </div>

                  {diagnosis.image && (
                    <img 
                      src={`http://localhost:5000${diagnosis.image}`} 
                      alt="Crop"
                      className="w-full h-32 object-cover rounded"
                    />
                  )}

                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Diagnosis</p>
                        <p className="text-sm text-muted-foreground">
                          {diagnosis.diagnosis.disease}
                        </p>
                      </div>
                    </div>

                    {diagnosis.recommendations && diagnosis.recommendations.length > 0 && (
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Recommendation</p>
                          <p className="text-sm text-muted-foreground">
                            {diagnosis.recommendations[0].description}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )) || (
                <p className="text-center text-muted-foreground py-8">
                  No diagnoses yet. Upload a crop image to get started!
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CropDoctor;
