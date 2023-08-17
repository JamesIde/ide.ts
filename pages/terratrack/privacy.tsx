import Helmet from "../../components/Navigation/Helmet";
import Layout from "../../components/Navigation/Layout";

function Privacy() {
  return (
    <Layout>
      <Helmet title="Terratrack Privacy Policy" />
      <div className="container w-full md:w-3/5 lg:w-3/5 xl:w-3/5 mx-auto p-2">
        <h1 className="playfair text-3xl">Terratrack Mobile Privacy Policy</h1>
        <h3 className="mt-2 mb-2 playfair text-xl">
          Effective Date: 24/6/2023
        </h3>
        <p className="mt-2 mb-2">
          This Privacy Policy governs the manner in which Terratrack collects,
          uses, maintains, and discloses information collected from usersof the
          Terratrack mobile application. This Privacy Policy applies to the App
          and all products and services offered by Terratrack.
        </p>
        <div>
          <h3 className="mt-2 mb-2 playfair text-2xl">
            Collection of Information
          </h3>
          <h4 className="playfair text-xl">1.1 Location Information:</h4>
          <p className="mt-2 mb-2">
            Terratrack requires access to your foreground location to provide
            continuous updates on your activities. We collect and store your
            location coordinates and the timestamp of your activity to deliver
            accurate tracking and mapping features. This information is securely
            stored on your device and may be uploaded to our servers or the
            cloud if you choose to utilize cloud storage.
          </p>
          <h4 className="playfair text-xl">1.2 Account Information:</h4>
          <p className="mt-2 mb-2">
            If you choose to create an account with Terratrack using Clerk, we
            collect and store the following information: your first name, last
            name, and email address. This information is used to provide
            personalized features, facilitate account management, and enhance
            your overall experience with the App.
          </p>

          <h3 className="mt-2 mb-2 playfair text-2xl">Battery Optimization</h3>
          <h4 className="playfair text-xl">1.3 Battery Optimization:</h4>
          <p className="mt-2 mb-2">
            To ensure accurate location updates when the app is in the
            background, Terratrack may require battery optimization to be turned
            off on some Android devices. This allows the App to maintain
            continuous tracking functionality. However, please note that you
            have the option to not disable battery optimization if you prefer to
            conserve battery life. Disabling battery optimization is not
            mandatory for using Terratrack, and the App will still function with
            location updates while running in the foreground.
          </p>
          <h3 className="mt-2 mb-2 playfair text-2xl">Cloud Storage</h3>
          <h4 className="playfair text-xl">1.4 Cloud Storage:</h4>
          <p className="mt-2 mb-2">
            Terratrack offers the option to upload your activities to the cloud.
            If you choose to utilize this feature, your activity data will be
            protected using Supabase authentication and Clerk. This ensures that
            your uploaded activities are securely stored and accessible only to
            you.
          </p>
          <h3 className="mt-2 mb-2 playfair text-2xl">Data Security</h3>
          <p className="mt-2 mb-2">
            We prioritize the security of your information and have implemented
            appropriate technical and organizational measures to protect it
            against unauthorized access, alteration, disclosure, or destruction.
            We employ industry-standard encryption protocols and secure storage
            practices to safeguard your data.
          </p>
          <h3 className="mt-2 mb-2 playfair text-2xl">
            Changes to this Privacy Policy
          </h3>
          <p className="mt-2 mb-2">
            We reserve the right to update or modify this Privacy Policy at any
            time. We encourage you to review this Privacy Policy periodically to
            stay informed about how we collect, use, and protect your
            information. Your continued use of the App after any modifications
            to this Privacy Policy will constitute your acknowledgment of the
            changes and your consent to abide by the updated terms.
          </p>
          <h3 className="mt-2 mb-2 playfair text-2xl">Contact Us</h3>
          <p className="mt-2 mb-2">
            If you have any questions or concerns about this Privacy Policy or
            Terratrack's privacy practices, please{" "}
            <a
              href="mailto:james.ide775@gmail.com"
              target="_#"
              className="text-blue-500 duration-500 cursor-pointer"
            >
              contact me.
            </a>
          </p>
        </div>
      </div>
    </Layout>
  );
}
export default Privacy;
