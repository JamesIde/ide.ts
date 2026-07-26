import SafeAreaView from "components/Misc/safeAreaView";
import Helmet from "../components/Navigation/Helmet";
import Layout from "../components/Navigation/Layout";
import { Github, Instagram, Linkedin, Mail, MapPin } from "lucide-react";
import LineSeparator from "components/Misc/lineSeparator";

function about() {
  return (
    <Layout>
      <SafeAreaView>
        <Helmet title="About" />
        <div className="xl:w-5/12 lg:w-6/12 md:w-10/12 mx-auto xl:mt-32 p-4 md:p-2">
          <h3 className="text-md font-semibold mb-4 tracking-wider">About</h3>
          <p className="text-gray-600 mt-3 leading-tight">
            I enjoy programming, hiking and photography.
          </p>
          <p className="text-gray-600 mt-3 leading-tight">
            I work as a developer here in Adelaide, and have worked across
            defence, pharmaceutical, state government and tertiary sectors.
          </p>
          <p className="text-gray-600 mt-3 leading-tight">
            What you see here is a vessel for collating and organising trips and
            photos from over the years.
          </p>

          <div className="md:mt-5 mt-4">
            <LineSeparator />
            <ul className="space-y-3 text-gray-600 md:mt-4 mt-2">
              <a
                href="mailto:james.ide775@gmail.com"
                className="flex items-center gap-2 text-sm hover:text-orange-700 hover:duration-200"
              >
                <Mail size={16} />
                <span>james.ide775@gmail.com</span>
              </a>
              <a
                href="https://www.instagram.com/james.ide/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm hover:text-orange-700 hover:duration-200"
              >
                <Instagram size={16} />
                <span>@james.ide</span>
              </a>
              <a
                href="https://github.com/jameside"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm hover:text-orange-700 hover:duration-200"
              >
                <Github size={16} />
                <span>@jameside</span>
              </a>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin size={16} />
                <span>Adelaide, Australia</span>
              </div>
            </ul>
            <p className="text-gray-600 mt-5 text-sm">
              Built with NextJS, Markdown, Contentful and TailwindCSS.
            </p>
          </div>
        </div>
      </SafeAreaView>
    </Layout>
  );
}
export default about;
