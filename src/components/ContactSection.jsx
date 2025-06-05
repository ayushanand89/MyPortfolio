import {
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Send,
  Twitch,
  Twitter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faLinkedin } from "@fortawesome/free-brands-svg-icons";

export const ContactSection = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    setTimeout(() => {
      toast({
        title: "Message sent!",
        description: "Thank you for your message. I'll get back to you soon.",
      });
      setIsSubmitting(false);
    }, 1500);
  };
  return (
    <section id="contact" className="py-24 px-4 relative bg-secondary/30">
      <div className="container mx-auto max-w-5xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Get In <span className="text-primary">Touch</span>
        </h2>

        <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">
          Have a project in mind or want to collaborate? Feel free to reach out.
          I'm always open to discussing new opportunities.
        </p>

        <div className="space-y-8">
          <h3 className="text-2xl font-semibold mb-6">Contact Information</h3>

          {/* All Contact Items */}
          <div className="flex flex-wrap justify-center gap-8 text-center">
            {/* Email */}
            <div className="flex items-center space-x-4 mx-auto">
              <div className="p-3 rounded-full bg-primary/10">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div className="text-left">
                <h4 className="font-medium">Email</h4>
                <a
                  href="mailto:ayushanand0108@gmail.com"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  ayushanand0108@gmail.com
                </a>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center space-x-4 mx-auto">
              <div className="p-3 rounded-full bg-primary/10">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <div className="text-left">
                <h4 className="font-medium">Phone</h4>
                <a
                  href="tel:+919315335517"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  +91 93153 35517
                </a>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center space-x-4 mx-auto">
              <div className="p-3 rounded-full bg-primary/10">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div className="text-left">
                <h4 className="font-medium">Location</h4>
                <p className="text-muted-foreground">New Delhi, India</p>
              </div>
            </div>

            {/* LinkedIn */}
            <div className="flex items-center space-x-4 mx-auto">
              <div className="p-3 rounded-full bg-primary/10">
                <FontAwesomeIcon
                  icon={faLinkedin}
                  className="h-6 w-6 text-primary"
                />
              </div>
              <div className="text-left">
                <h4 className="font-medium">LinkedIn</h4>
                <a
                  href="https://www.linkedin.com/in/ayush-anand-a91919266/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  linkedin.com/in/ayush-anand
                </a>
              </div>
            </div>

            {/* Discord */}
            <div className="flex items-center space-x-4 mx-auto">
              <div className="p-3 rounded-full bg-primary/10">
                <FontAwesomeIcon
                  icon={faDiscord}
                  className="h-6 w-6 text-primary"
                />
              </div>
              <div className="text-left">
                <h4 className="font-medium">Discord</h4>
                <a
                  href="http://discordapp.com/users/518641395729432598"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  @ayush#1234 {/* Change to your actual handle if needed */}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
