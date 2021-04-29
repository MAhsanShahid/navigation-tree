import React from 'react';
import {Accordion, Button, Card, FormControl, InputGroup} from 'react-bootstrap';
import treeData from "../../resources/treeData";


class MyAccordion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            treeData: treeData,
            collapse: true,
            showInputField: false,
            newTitle: '',
            oldTitle: '',
            addChild: false
        };
        this.tree = this.tree.bind(this);
        this.inputField = this.inputField.bind(this);
        this.closeEditBox = this.closeEditBox.bind(this);
        this.updateTitle = this.updateTitle.bind(this);
        this.addChild = this.addChild.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.delItem = this.delItem.bind(this);
    }

    inputField(title, actionType) {
        if (actionType === 'addChild') {
            this.setState({showInputField: true, oldTitle: title, addChild: true})
        } else
            this.setState({showInputField: true, oldTitle: title})
    }

    closeEditBox() {
        this.setState({showInputField: false})
    }

    updateTitle(title, updatedTitle, treeData) {
        if (updatedTitle.length !== 0) {
            treeData.map(node => {
                if (node.title === title) {
                    node.title = updatedTitle;
                    this.state.treeData[node] = node;
                    this.setState({treeData: this.state.treeData, showInputField: false});
                }
                if (node.children) {
                    this.updateTitle(title, updatedTitle, node.children);
                }
            });
        } else {
            alert("Accordion title cannot be empty");
        }
    }

    addChild(title, newTitle, treeData) {
        let newChild = {title: newTitle, children: []};
        if (newTitle.length !== 0) {
            treeData.map(node => {
                if (node.title === title) {
                    node.children.push(newChild);
                    this.state.treeData[node] = node;
                    this.setState({treeData: this.state.treeData, showInputField: false, addChild: false});
                }
                if (node.children) {
                    this.addChild(title, newTitle, node.children);
                }
            });
        } else {
            alert("Accordion title cannot be empty");
        }
    }

    delItem(title, treeData) {
        let td = this.deleteItem(title, treeData);
        this.setState({treeData: td});

    }

    deleteItem(title, treeData) {
        return treeData.map(item => {
            return {...item}
        }).filter(item => {
            if ('children' in item) {
                item.children = this.deleteItem(title, item.children);
            }
            return item.title !== title;
        });
    }


//added a `depth` property with a default value of 0
// That way we don't have to pass it to the top level of the tree
    tree({items, depth = 0}) {
        if (!items || !items.length) {
            return null
        }
        return items.map((item, index) => (
            <Accordion defaultActiveKey={(index).toString()} key={index}>
                <Card>
                    <Card.Header>
                        <Accordion.Toggle as={Button} variant="link" eventKey={index.toString()}>
                            {item.title}
                        </Accordion.Toggle>
                        <Button style={{float: "right"}} variant="outline-danger" size="sm" name={item.title}
                                onClick={(e) => {
                                    this.delItem(e.target.name, this.state.treeData)
                                }}>Delete</Button>
                        <Button style={{float: "right"}} variant="outline-success" size="sm" name={item.title}
                                onClick={(e) => {
                                    this.inputField(e.target.name, 'addChild')
                                }}>Add a Child</Button>
                        <Button style={{float: "right"}} variant="outline-secondary" size="sm" name={item.title}
                                onClick={(e) => {
                                    this.inputField(e.target.name, 'editTitle')
                                }}>Edit</Button>
                        {this.state.showInputField && this.state.oldTitle === item.title ?

                            (this.state.addChild ? <InputGroup className="mb-3">
                                    <FormControl
                                        placeholder={"Enter a title for new child of " + item.title}
                                        aria-label={item.title}
                                        aria-describedby="basic-addon2"
                                        onChange={e => this.state.newTitle = e.target.value}
                                        type="text"
                                    />
                                    <InputGroup.Append>
                                        <Button variant="outline-secondary" name={item.title}
                                                onClick={(e) => this.addChild(e.target.name, this.state.newTitle, this.state.treeData)}>Add</Button>
                                        <Button variant="outline-secondary"
                                                onClick={(e) => this.closeEditBox()}>Close</Button>
                                    </InputGroup.Append>
                                </InputGroup> :
                                <InputGroup className="mb-3">
                                    <FormControl
                                        placeholder={"Enter a new title for " + item.title}
                                        aria-label={item.title}
                                        aria-describedby="basic-addon2"
                                        onChange={e => this.state.newTitle = e.target.value}
                                        type="text"
                                    />
                                    <InputGroup.Append>
                                        <Button variant="outline-secondary" name={item.title}
                                                onClick={(e) => this.updateTitle(e.target.name, this.state.newTitle, this.state.treeData)}>Save</Button>
                                        <Button variant="outline-secondary"
                                                onClick={(e) => this.closeEditBox()}>Close</Button>
                                    </InputGroup.Append>
                                </InputGroup>) : null
                        }
                    </Card.Header>
                    {item.children.length !== 0 ?
                        <Accordion.Collapse eventKey={index.toString()}>
                            <Card.Body>
                                <this.tree items={item.children} depth={depth + 1}/>
                            </Card.Body>
                        </Accordion.Collapse> : null
                    }
                </Card>
            </Accordion>

        ))
    }

    render() {
        if (!this.state.treeData || !this.state.treeData.length) {
            return null
        }

        return (
            <this.tree items={this.state.treeData}/>
        );
    }
}

export default MyAccordion;

