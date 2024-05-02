import Folder from "../../assets/icons/Folder.svg";
import Node from "../../assets/icons/Node.svg";
import Node2D from "../../assets/icons/Node2D.svg";
import Node3D from "../../assets/icons/Node3D.svg";

const SideBar = () => {
    return (
        <div className="fixed top-0 left-0 h-screen w-16 m-0 flex flex-col bg-dark_background text-text_normal shadow-lg">
            <SideBarIcon icon={<img src={Node} alt="Node"/>} text="Node" />
            <Divider />
            <SideBarIcon icon={<img src={Node2D} alt="Node2D"/>} text="Node2D" />
            <SideBarIcon icon={<img src={Node3D} alt="Node3D"/>} text="Node3D" />

        </div>
    );
};

const SideBarIcon = ({ icon, text = '' }) => (
    <div className="sidebar-icon group">
        <img src={Folder} alt="Node2D"/>
        {icon}
        <span class="sidebar-tooltip group-hover:scale-100">
            {text}
        </span>
    </div>
);

const Divider = () => <hr className="sidebar-hr" />;

export default SideBar;