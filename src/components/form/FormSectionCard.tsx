import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FormSectionCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export default function FormSectionCard({ title, description, children }: FormSectionCardProps) {
  return (
    <Card className="shadow-md rounded-md">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-foreground">{title}</CardTitle>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-6">{children}</CardContent>
    </Card>
  );
}
