import MyFirstComponent from "@/components/MyFirstComponent";
import AdminDashboard from "@/components/AdminDashboard";
import CreateDialog from "@/components/CreateDialog";
import NewUserForm from "@/components/forms/NewUserForm";
// import ActivityCategory from "@/components/ActivityCategory";
export default function AdminPage() {

    return (<>
        <AdminDashboard />
        {/* <ActivityCategory/> */}
        <CreateDialog title="Tourism Governor" type="gov"  form={<NewUserForm type="gov"/>}/>
        <CreateDialog title="Admin" type="admin" form={<NewUserForm type="admin"/>}/>
        </>);
}
