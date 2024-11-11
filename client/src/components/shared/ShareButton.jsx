import { Copy, Mail, Send } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import PropTypes from "prop-types";

ShareButton.propTypes = {
  link: PropTypes.string,
  title: PropTypes.string,
};
export function ShareButton({
  link = "https://www.google.com",
  title = "Google",
}) {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [showEmailInput, setShowEmailInput] = useState(false);

  // Copy link to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(link);
      toast({ title: "Link copied to clipboard!" });
    } catch (error) {
      console.error("Failed to copy link", error);
      toast({ variant: "destructive", title: "Could not copy the link" });
    }
  };

  // Generate email link
  const getEmailLink = () => {
    const subject = encodeURIComponent(`Check out this activity: ${title}`);
    const body = encodeURIComponent(
      `Hi there,\n\nI wanted to share this with you:\n\n${link}\n\nYou can explore activities, museums, historical places, or plan an itinerary!\n\nEnjoy!`
    );
    console.log(`mailto:${email}?subject=${subject}&body=${body}`);
    return `mailto:${email}?subject=${subject}&body=${body}`;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Share</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share {title} now!</DialogTitle>
          <DialogDescription>
            Copy to clipboard or send an email to share {title}.
          </DialogDescription>
        </DialogHeader>

        {/* Link and Copy Button */}
        <div className="flex flex-col space-y-2">
          <Label htmlFor="link">Link</Label>
          <div className="flex items-center space-x-2">
            <Input id="link" value={link} readOnly />
            <Button
              type="button"
              size="icon"
              className="p-2"
              onClick={copyToClipboard}
              title="Copy to clipboard"
            >
              <Copy />
            </Button>
          </div>
        </div>

        <Button
          onClick={() => setShowEmailInput(!showEmailInput)}
          size="sm"
          variant="secondary"
        >
          <Mail className="mr-2" /> Email
        </Button>

        {showEmailInput && (
          <div className="flex flex-col space-y-2 mt-4">
            <Label htmlFor="email">Recipient’s Email</Label>
            <div className="flex flex-row items-center">
              <Input
                id="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <a
                href={email ? getEmailLink() : undefined}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  as="a"
                  href={email ? getEmailLink() : undefined}
                  size="icon"
                  variant="secondary"
                  target="_blank"
                  rel="noopener noreferrer"
                  disabled={!email} // Disable if email is empty
                  className="p-2 ml-2"
                >
                  <Send />
                </Button>
              </a>
            </div>
          </div>
        )}

        <DialogFooter className="flex flex-col space-y-4 mt-4 sm:space-y-0 sm:flex-row sm:justify-start sm:space-x-2">
          {/* Close button */}
          <DialogClose asChild>
            <Button type="button" variant="secondary" size="sm">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
