import { createRoutesFromElements, Route } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import Layout from "@/components/layout/Layout";
import MyProfilePage from "@/pages/MyProfilePage";
import AdminPage from "@/pages/AdminPage";
import ComponentTestPage from "@/pages/ComponentTestPage";
import ActivitiesPage from "@/pages/ActivitiesPage";
import HistoricalPage from "@/pages/HistoricalPage";
import HistoricalTourists from "@/pages/HistoricalPageTourists";
import MarketplacePage from "@/pages/MarketplacePage";
import RegistrationPage from "@/pages/RegistrationPage";
import ErrorBoundary from "@/components/errorBoundary/ErrorBoundary";
import NotFoundPage from "@/components/errorBoundary/NotFoundPage";
import SingleActivityPage from "@/pages/SingleActivityPage";
import PointsAndLoyalty from "@/components/dropdown/Pointsandloyality";
import SingleHistoricalPage from "@/pages/SingleHistoricalPage";
import FlightBookingApp from "@/pages/FlightBookPage";
import HotelBookingApp from "@/pages/HotelBookPage";
import TourGuides from "@/components/touristPage/TourGuides";
import ItinerariesMade from "@/components/touristPage/ItinerariesMade";
import ActivityAttended from "@/components/touristPage/ActivityAttended";
import OrderHistory from "@/components/touristPage/OrderHistory";
import TouristDashboard from "@/pages/TouristDashboard";
import ItinerariesTouristsPage from "@/pages/ItinerariesTouristsPage";
import SingleItineraryTouristsPage from "@/pages/SingleItineraryTouristsPage";
import CreateItineraryPage from "@/pages/CreateItineraryPage";
import EditItineraryPage from "@/pages/EditItineraryPage";
import ItinerariesTourGuidePage from "@/pages/ItinerariesTourGuidePage";
import SingleItineraryTourGuidePage from "@/pages/SingleItineraryTourGuidePage";
import Transportation from "@/pages/TransportationPage";
import SingleItineraryAdminPage from "@/pages/SingleItineraryAdminPage";
import ComplaintsPageTourist from "@/pages/ComplaintsPageTourist";
import ComplaintDetailsPageTourist from "@/pages/ComplaintDetailsPageTourist";
import GovernorsList from "@/components/adminPage/GovernorsList";
import AdminsList from "@/components/adminPage/AdminsList";
import ActivityCategory from "@/components/adminPage/ActivityCategory";
import ActivityTags from "@/components/adminPage/ActivityTags";
import ItineraryTags from "@/components/adminPage/ItineraryTags";
import ManagePromoCodes from "@/components/adminPage/ManagePromoCodes"; //new
import PromoCodeDisplayTourist from "@/pages/PromoCodeDisplayTourist"; //new
import AdminProducts from "@/components/adminPage/AdminProducts";
import ItinerariesView from "@/components/adminPage/ItinerariesView";
import Complaints from "@/components/adminPage/Complaints";
import OneComplain from "@/components/adminPage/OneComplain";
import AccountDashboard from "@/components/adminPage/AdminDashboard";
import DeleteRequests from "@/components/adminPage/DeleteRequests";
import ItineraryBookings from "@/pages/ItinerariesBookings";
import BookActivities from "@/components/dropdown/BookActivities";
import BookItinerary from "@/components/dropdown/BookItineraries";
import DocumentReview from "@/components/adminPage/DocumentReview";
import SingleTransportationPage from "@/pages/SingleTransportationPage";
import Booked from "@/pages/BookedPage";
import SalesReportClientPage from "@/pages/SalesReportClientPage";
import SalesReport from "@/components/adminPage/SalesReport";
import Delivery from "@/components/CheckOutPage/Delivery";
import PaymentTransactionPage from "@/pages/PaymentTransactionPage";
import LoginPage from "@/pages/LoginPage";
import WishlistPage from "@/pages/WishlistPage";
import Cart from "@/pages/CartPage";
import ProductPage from "@/pages/ProductPage";
import CheckoutPage from "@/pages/CheckoutPage";
import BookmarkedPage from "@/pages/BookmarkedPage";

const routes = createRoutesFromElements(
  <Route path="/" element={<Layout />}>
    <Route index element={<HomePage />} />
    <Route path="profile" element={<MyProfilePage />} />
    <Route path="activities" element={<ActivitiesPage />} />
    <Route path="historical" element={<HistoricalPage />} />
    <Route path="marketplace" element={<MarketplacePage />} />
    <Route path="register" element={<RegistrationPage />} />
    <Route path="login" element={<LoginPage />} />
    <Route path="activities" element={<ActivitiesPage />} />
    <Route path="historicalTourists" element={<HistoricalTourists />} />
    <Route path="sales-report" element={<SalesReportClientPage />} />

    <Route
      path="itinerariesTourists"
      element={<ItinerariesTouristsPage />}
    ></Route>
    <Route
      path="itinerariesTourists/:id"
      element={<SingleItineraryTouristsPage />}
    ></Route>
    <Route path="itineraries" element={<ItinerariesTourGuidePage />}></Route>
    <Route
      path="itinerariesTourGuide/:id"
      element={<SingleItineraryTourGuidePage />}
    ></Route>
    <Route
      path="itinerariesAdmin/:id"
      element={<SingleItineraryAdminPage />}
    ></Route>
    <Route path="createItinerary" element={<CreateItineraryPage />}></Route>
    <Route path="editItinerary/:id" element={<EditItineraryPage />}></Route>

    <Route path="activity/:id" element={<SingleActivityPage />} />
    <Route path="place/:name" element={<SingleHistoricalPage />} />
    <Route path="BookItinerary" element={<BookItinerary />} />
    <Route
      path="*"
      element={
        <ErrorBoundary>
          <NotFoundPage />
        </ErrorBoundary>
      }
    />
    <Route path="componentTest" element={<ComponentTestPage />} />
    <Route path="bookingFlight" element={<FlightBookingApp />}></Route>
    <Route path="bookingHotel" element={<HotelBookingApp />}></Route>
    <Route path="transportations/:idAdv" element={<Transportation />}></Route>
    <Route path="transportations" element={<Transportation />}></Route>
    <Route
      path="transportation/:id"
      element={<SingleTransportationPage />}
    ></Route>
    <Route path="cart" element={<Cart />}></Route>
    <Route path="checkout" element={<CheckoutPage />}></Route>

    <Route path="cart" element={<Cart />}></Route>
    <Route path="touristDashboard" element={<TouristDashboard />}>
      <Route path="profile" element={<MyProfilePage />} />
      <Route path="tour-guides" element={<TourGuides />} />
      <Route path="booked" element={<Booked />}></Route>
      <Route path="itineraries-made" element={<ItinerariesMade />} />
      <Route path="activity-attended" element={<ActivityAttended />} />
      <Route path="order-history" element={<OrderHistory />} />
      <Route path="sales-report" element={<SalesReportClientPage />} />
      <Route path="addresses" element={<Delivery />} />
      <Route path="bookmarked" element={<BookmarkedPage />} />
    </Route>

    <Route
      path="*"
      element={
        <ErrorBoundary>
          <NotFoundPage />
        </ErrorBoundary>
      }
    />
    <Route path="componentTest" element={<ComponentTestPage />} />
    <Route path="bookingFlight" element={<FlightBookingApp />}></Route>
    <Route path="bookingHotel" element={<HotelBookingApp />}></Route>
    <Route path="transportation/:idAdv" element={<Transportation />}></Route>
    <Route path="transportation" element={<Transportation />}></Route>
    <Route path="marketplace/:id" element={<ProductPage />} />
    <Route path="admin" element={<AdminPage />}>
      <Route path="users" element={<AccountDashboard />} />
      <Route path="tourism-governors" element={<GovernorsList />} />
      <Route path="admins" element={<AdminsList />} />
      <Route path="activity-categories" element={<ActivityCategory />} />
      <Route path="activity-tags" element={<ActivityTags />} />
      <Route path="itinerary-tags" element={<ItineraryTags />} />
      <Route path="products" element={<AdminProducts />} />
      <Route path="itineraries" element={<ItinerariesView />} />
      <Route path="complaints" element={<Complaints />} />
      <Route path="complaints/:complaintID" element={<OneComplain />} />
      <Route path="delete-requests" element={<DeleteRequests />} />
      <Route path="document-review" element={<DocumentReview />} />
      <Route path="sales-report" element={<SalesReport />} />
      <Route path="manage-promo-code" element={<ManagePromoCodes />} />
    </Route>
    <Route path="transportations/:idAdv" element={<Transportation />}></Route>
    <Route path="transportations" element={<Transportation />}></Route>
    <Route
      path="transportation/:id"
      element={<SingleTransportationPage />}
    ></Route>
    <Route path="wishlist" element={<WishlistPage />} />

    <Route path="touristDashboard" element={<TouristDashboard />}>
      <Route path="profile" element={<MyProfilePage />} />
      <Route path="tour-guides" element={<TourGuides />} />
      <Route path="booked" element={<Booked />}></Route>
      <Route path="itineraries-made" element={<ItinerariesMade />} />
      <Route path="activity-attended" element={<ActivityAttended />} />
      <Route path="activitiy-bookings" element={<BookActivities />} />
      <Route path="order-history" element={<OrderHistory />} />
      <Route path="complaints" element={<ComplaintsPageTourist />} />
      <Route path="rewards" element={<PointsAndLoyalty />} />
      <Route path="transactions" element={<PaymentTransactionPage />} />
      <Route path="my-products" element={<AdminProducts seller />} />
      <Route path="promo-codes" element={<PromoCodeDisplayTourist />} />

      <Route path="itinerary-bookings" element={<ItineraryBookings />}></Route>
      {/* <Route path="bookings" element={<Booked />} /> */}
      <Route path="complaints/:id" element={<ComplaintDetailsPageTourist />} />
    </Route>
  </Route>
);

export default routes;
