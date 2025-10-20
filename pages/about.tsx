import SafeAreaView from "components/Misc/safeAreaView";
import Helmet from "../components/Navigation/Helmet";
import Layout from "../components/Navigation/Layout";
import { Github, Instagram, Linkedin, Mail, MapPin } from "lucide-react";
import LineSeparator from "components/Misc/lineSeparator";

function about() {
  return (
    <Layout>
      <SafeAreaView>
        <Helmet title="about" />
        <div className="xl:w-5/12 lg:w-6/12 md:w-10/12 mx-auto xl:mt-32 p-2 ">
          <h3 className="text-md font-semibold mb-4 tracking-wider">About</h3>
          <p className="text-gray-600">Software developer and hiker occasionally sharing photos and writing.</p>
          <div className="md:mt-10 mt-4">
            <LineSeparator name="Get in touch" />
            <ul className="space-y-3 text-gray-600 md:mt-4 mt-2">
              <a
                href="mailto:james.ide775@gmail.com"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail size={16} />
                <span>james.ide775@gmail.com</span>
              </a>
              <a
                href="https://www.instagram.com/james.ide/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Instagram size={16} />
                <span>@james.ide</span>
              </a>
              <a
                href="https://www.linkedin.com/in/jamesaide/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Linkedin size={16} />
                <span>James Ide</span>
              </a>
              <a
                href="https://github.com/jameside"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github size={16} />
                <span>@jameside</span>
              </a>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin size={16} />
                <span>Adelaide, Australia</span>
              </div>
            </ul>
            <p className="text-gray-600 mt-5 text-sm">Built with NextJS, Markdown, Contentful and TailwindCSS.</p>
          </div>
        </div>
      </SafeAreaView>
    </Layout>
  );
}
export default about;
