
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function  DialogTerms() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="p-0">Terms and Conditions</Button>
      </DialogTrigger>
      <DialogContent className={"lg:max-w-screen-lg overflow-y-scroll max-h-screen"}
      >
        <DialogHeader>
          <DialogTitle>Pack n' Quack Terms and Conditions</DialogTitle>
          <DialogDescription>
         Welcome to <strong>Pack n' Quack</strong>! By using our website or services, you agree to the following terms and conditions. Please read them carefully.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-start flex-col space-x-2">
    <h2 className="text-xl font-bold mt-6 mb-2">1. <strong>Personal Information Collection</strong></h2>
      <p>We collect personal information from users to provide better services. By creating an account or using our services, you agree to the collection and use of the following personal information:</p>
      <ul className="list-disc list-inside">
        <li><strong>Name</strong>: Required for identification and communication.</li>
        <li><strong>Email</strong>: Required for account creation, notifications, and important updates.</li>
        <li><strong>Password</strong>: Stored securely for account access.</li>
        <li><strong>Payment Method</strong>: Required for transactions and securely processed by third-party payment providers.</li>
      </ul>
      <h2 className="text-xl font-bold mt-6 mb-2">2. <strong>Use of Your Personal Information</strong></h2>
      <p>We use the personal information you provide for the following purposes:</p>
      <ul className="list-disc list-inside">
        <li>To facilitate communication, order processing, and transaction management.</li>
        <li>To improve user experience and website functionality.</li>
        <li>To notify you about account updates, promotions, and offers.</li>
      </ul>

      <h2 className="text-xl font-bold mt-6 mb-2">3. <strong>Payment Information</strong></h2>
      <p>By providing your payment method, you authorize <strong>Pack n' Quack</strong> to process transactions in accordance with our services. Your payment details will be processed securely by our third-party payment providers and will not be stored directly on our servers.</p>

      <h2 className="text-xl font-bold mt-6 mb-2">4. <strong>Access to Gallery or Photos</strong></h2>
      <p><strong>Pack n' Quack</strong> may request access to your gallery or photos for purposes such as uploading images relevant to your account, products, or services you wish to showcase on our platform. You have full control over granting or revoking this access in your device settings.</p>

      <h2 className="text-xl font-bold mt-6 mb-2">5. <strong>Location Information</strong></h2>
      <p>By using <strong>Pack n' Quack</strong>, you may allow us to collect location data from your device to enhance your experience. Location data may be used for:</p>
      <ul className="list-disc list-inside">
        <li>Improving service recommendations based on your location.</li>
        <li>Enabling location-based features (e.g., finding local services).</li>
      </ul>

      <h2 className="text-xl font-bold mt-6 mb-2">6. <strong>User Responsibilities</strong></h2>
      <p>You agree that you will not:</p>
      <ul className="list-disc list-inside">
        <li>Provide false or misleading information.</li>
        <li>Share your account or password with others.</li>
        <li>Violate any applicable local, state, or international laws.</li>
      </ul>

      <h2 className="text-xl font-bold mt-6 mb-2">7. <strong>Data Security</strong></h2>
      <p>We are committed to protecting your personal information and employ industry-standard security measures. However, no method of data transmission or storage is 100% secure, and we cannot guarantee absolute security.</p>

      <h2 className="text-xl font-bold mt-6 mb-2">8. <strong>Changes to Terms</strong></h2>
      <p>We may update these terms from time to time. Changes will be posted on this page, and your continued use of <strong>Pack n' Quack</strong> following any changes indicates your acceptance of the updated terms.</p>

      <h2 className="text-xl font-bold mt-6 mb-2">9. <strong>Contact Us</strong></h2>
      <p>If you have any questions or concerns regarding these terms, please contact us at <strong>support@packnquack.com</strong>.</p>


        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

     

