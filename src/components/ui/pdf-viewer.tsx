import { useState } from "react"
import { Card, CardContent } from "./card"
import { Loader2 } from "lucide-react"

interface PDFViewerProps {
  url: string
  title?: string
}

export function PDFViewer({ url, title }: PDFViewerProps) {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <Card className="w-full overflow-hidden">
      {title && (
        <div className="px-4 py-2 border-b bg-muted/50">
          <h3 className="text-sm font-medium">{title}</h3>
        </div>
      )}
      <CardContent className="p-0 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        <iframe
          src={`${url}#toolbar=1&navpanes=1`}
          className="w-full h-[500px] border-0"
          onLoad={() => setIsLoading(false)}
          title={title || "PDF Document"}
        />
      </CardContent>
    </Card>
  )
}