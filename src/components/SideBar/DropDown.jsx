import { useState } from "react";
import { Outlet, Link } from "react-router-dom";

import {
    HomeIcon,
    Script,
    File,
    Folder,
    Node,
    Node2D,
    Node3D,
    CharacterBody2D,
    CharacterBody3D,
    AnimationPlayer,
    Viewport,
    Window,
    AcceptDialog,
    ConfirmationDialog,
    FileDialog,
    Popup,
    PopupMenu,
    PopupPanel,
    SubViewport,
    Camera2D
} from "../../assets";

const dropDownData = [
    {
<<<<<<< HEAD
        "icon": HomeIcon,
        "link" : "/",
        "text": "Home",
        "children": []
    },
    {
        "icon": File,
        "link" : "/Resources",
        "text": "Resources",
        "children": []
    },
    {
        "icon": Camera2D,
        "link" : "/Camera2D",
        "text": "Camera 2D",
        "children": []
=======
        "icon": Node2D,
        "link": false,
        "text": "Node",
        "children": [
            { "icon": Node2D, "text": "Node2D", "link": false, "children": [{ "icon": Node2D, "text": "Node2D", "link": "https://google.com/", "children": [] }] },
            { "icon": Node, "text": "Node", "link": "https://google.com/", "children": [] },
            { "icon": Node, "text": "Node", "link": "https://google.com/", "children": [] },
            { "icon": Node, "text": "Node", "link": "https://google.com/", "children": [] },
        ]
>>>>>>> 1ad5396 (dropdown save for pull)
    },
    {
        "icon": Viewport,
        "link" : false,
        "text": "Viewport",
        "children": [
            {
                "icon": Viewport,
                "link" : false,
                "text": "Viewport",
                "children": []
            },
            {
                "icon": Window,
                "link" : false,
                "text": "Window",
                "children": [
                    { 
                        "icon": Window,  
                        "text": "Window", 
                        "link": false, 
                        "children": [] 
                    },
                    { 
                        "icon": AcceptDialog, 
                        "text": "AcceptDialog", 
                        "link": false, 
                        "children": [
                            {
                                "icon": AcceptDialog,
                                "link" : false,
                                "text": "AcceptDialog",
                                "children": []
                            },
                            { 
                                "icon": ConfirmationDialog,  
                                "text": "AcceptDialog", 
                                "link": false, 
                                "children": [
                                    {
                                        "icon": ConfirmationDialog,
                                        "link" : false,
                                        "text": "ConfirmationDialog",
                                        "children": []
                                    },
                                    { 
                                        "icon": FileDialog,  
                                        "text": "AcceptDialog", 
                                        "link": false, 
                                        "children": [] 
                                    }
                                ] 
                            }
                        ] 
                    },
                    { 
                        "icon": Popup, 
                        "text": "Popup", 
                        "link": false, 
                        "children": [
                            { 
                                "icon": Popup, 
                                "text": "Popup", 
                                "link": false, 
                                "children": []
                            },
                            { 
                                "icon": PopupMenu,  
                                "text": "PopupMenu", 
                                "link": false, 
                                "children": [] 
                            },
                            { 
                                "icon": PopupPanel, 
                                "text": "PopupPanel", 
                                "link": false, 
                                "children": [] 
                            }
                        ] 
                    }
                ]
            },
            {
                "icon": SubViewport,
                "link" : false,
                "text": "SubViewport",
                "children": []
            }
        ]
    },

]

const DropDown = () => (
    <div>
        <div className="fixed top-0 left-0 h-screen w-16 m-0 flex flex-col bg-dark_background text-text_normal shadow-lg">
            {dropDownData.map((item, i) => (
                <DropDownItem items={item.children} base={item.icon} link={item.link} text={item.text}/>
            ))}
        </div>
        <div className="pl-16"><Outlet /></div>
    </div>
);

function DropDownItem({items = [{ "icon": Node, "text": "Node", "link": "https://google.com/", "children": [] }], base = Node, link=false, text = "Node"}) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="sidebar-folder">
            <button type="button" onClick={() => {
                    { !link ? (
                        setIsOpen((prev) => !prev)
                    ) : (
                        setIsOpen((prev) => prev)
                    )}
                }}> 
                <Link to={link}>
                    {!isOpen ? (
                        <SideBarIcon icon={<img src={base} alt="Node"/>} text={text} />
                    ) : (
                        <SideBarIcon icon={<img src={Folder} alt="Folder"/>} text="Close" /> 
                    )}
                </Link>
            </button>
            {!isOpen ? (
                <div />
            ) : (
                <div>
                    {items.map((item, i) => (
                        <div>
                            <DropDownItem items={item.children} base={item.icon} link={item.link} text={item.text}/>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const SideBarIcon = ({ icon, text = '', link=false}) => (
    <div className="sidebar-icon group">
        {icon}
        <span className="sidebar-tooltip group-hover:scale-100">
            {text}
        </span>
    </div>
);

export default DropDown;