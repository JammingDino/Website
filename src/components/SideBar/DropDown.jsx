import { useState } from "react";

import {
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
} from "../../assets";

const dropDownData = [
    { 
        "icon": Node2D,
        "link": false,
        "text": "Node",
        "children": [
            { "icon": Node2D, "text": "Node2D", "link": false, "children": [{ "icon": Node2D, "text": "Node2D", "link": "https://google.com/", "children": [] }] },
            { "icon": Node, "text": "Node", "link": "https://google.com/", "children": [] },
            { "icon": Node, "text": "Node", "link": "https://google.com/", "children": [] },
            { "icon": Node, "text": "Node", "link": "https://google.com/", "children": [] },
        ]
    },
    {
        "icon": Viewport,
        "link" : false,
        "text": "Viewport",
        "children": [
            {
                "icon": Window,
                "link" : false,
                "text": "Window",
                "children": [
                    
                ]
            },
            {
                "icon": SubViewport,
                "link" : false,
                "text": "Window",
                "children": []
            }
        ]
    },
    { "icon": AnimationPlayer, "text": "AnimationPlayer", "link": "https://google.com/", "children": [] },
    { "icon": Node, "text": "Node", "link": "https://google.com/", "children": [] },
    { "icon": Node, "text": "Node", "link": "https://google.com/", "children": [] },
    { "icon": Node, "text": "Node", "link": "https://google.com/", "children": [] },
]

const DropDown = () => (
    <div className="fixed top-0 left-0 h-screen w-16 m-0 flex flex-col bg-dark_background text-text_normal shadow-lg">
        {dropDownData.map((item, i) => (
            <DropDownItem items={item.children} base={item.icon} link={item.link}/>
        ))}
    </div>
);

function DropDownItem({items = [{ "icon": Node, "text": "Node", "link": "https://google.com/", "children": [] }], base = Node, link=false}) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="sidebar-folder">
            <button type="button" onClick={() => setIsOpen((prev) => !prev)}> 
                <a href={link}>
                    {!isOpen ? (
                        <SideBarIcon icon={<img src={base} alt="Node"/>} text="Node" />
                    ) : (
                        <SideBarIcon icon={<img src={Folder} alt="Folder"/>} text="Close" /> 
                    )}
                </a>
            </button>
            {!isOpen ? (
                <div />
            ) : (
                <div>
                    {items.map((item, i) => (
                        <div>
                            <DropDownItem items={item.children} base={item.icon} link={item.link}/>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const SideBarIcon = ({ icon, text = '', link=false}) => (
    <a className="sidebar-icon group" href={link}>
        {icon}
        <span className="sidebar-tooltip group-hover:scale-100">
            {text}
        </span>
    </a>
);

export default DropDown;