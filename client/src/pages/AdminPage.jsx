import MyFirstComponent from "@/components/MyFirstComponent";
import AdminDashboard from "@/components/AdminDashboard";
import CreateNewUser from "@/components/CreateNewUser";
// import ActivityCategory from "@/components/ActivityCategory";
export default function AdminPage() {
    return (<>
        <AdminDashboard />
        {/* <ActivityCategory/> */}
        <CreateNewUser title="Tourism Governor" type="gov"/>
        <CreateNewUser title="Admin" type="admin"/>
        </>);
}
