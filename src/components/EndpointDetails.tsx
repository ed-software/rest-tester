import React from 'react'
import { 
        ControlGroup, 
        InputGroup, 
        Classes, 
        Callout, 
        HTMLTable, 
        Switch, 
        Button, 
        Tabs, 
        Tab, 
        TagInput, 
        Tag, 
        Intent, 
        Card, 
        Alignment,
        Label,
        NumericInput,
        MenuItem,
        ITagProps,
    } from "@blueprintjs/core";
import { path_item, parameter } from '../interfaces/Swagger';
import { operationHash } from './EndpointCard';
import { Item, ItemRight } from './Settings';
import OperationSelect from './OperationSelect';

interface EndpointDetailsProps {
    path: path_item,
    endpoint: string,
    handleRunTests: any,
    baseURL: string,
}

export default function EndpointDetails(props: EndpointDetailsProps) {
    let completeURL = `${props.baseURL}${props.endpoint}`;
    return (
        <div className={Classes.DIALOG_BODY}>
            <Tabs animate defaultSelectedTabId={0}>
                {Object.keys(props.path).map((operationName: string, key: number) => (
                    <Tab id={key} key={key} title={operationName.toUpperCase()} panelClassName={Classes.FILL} panel={
                        <Card>
                        <EndpointDetail 
                            operation={[operationName, Object.values(props.path)[key]]}
                            completeURL={completeURL}
                            handleRunTests={props.handleRunTests}
                        />
                        </Card>
                    }/>
                ))}
            </Tabs>
        </div>
    )
}

interface EndpointDetailProps {
    operation: [string, any],
    completeURL: string,
    handleRunTests: any
}

export function EndpointDetail(props: EndpointDetailProps) {
    let [operationName, operationObj] = props.operation;
    let paramHash: {[param: string]: string} = {
        "query": "Query",
        "header": "Header",
        "path": "Path",
        "formData": "Form Data",
        "body": "Body",
    };

    return (
        <div>
            <ControlGroup>
                <Button intent={operationHash[operationName]}>
                    {operationName.toUpperCase()}
                </Button>
                <InputGroup fill type="text" value={props.completeURL}/>
                <Button 
                    intent="primary" 
                    icon="play" 
                    onClick={() => props.handleRunTests(props.operation)}
                >
                    Run Tests
                </Button>
            </ControlGroup>
            <div>
                <h3>Testing Rules</h3>
                <Switch
                    label="Methodology"
                    innerLabel="RT"
                    innerLabelChecked="ART"
                    alignIndicator={Alignment.RIGHT}
                />
                <Switch
                    label="Abort on Failure"
                    innerLabel="No"
                    innerLabelChecked="Yes"
                    alignIndicator={Alignment.RIGHT}
                />
                <Item>
                    <Label>
                        Maximum Tests
                    </Label>
                    <ItemRight>
                        <NumericInput 
                            placeholder="Unlimited" 
                            name="maxNum"
                            value={0}
                        />
                    </ItemRight>
                </Item>
                {operationObj.parameters?(
                <>
                <h3>Test Parameters</h3>
                <Tabs vertical>
                    {["query", "header", "path", "formData", "body"].map((paramType: string, index: number) => {
                        let params = Object.values(operationObj.parameters as [parameter])
                                        .filter((param: parameter) => param.in === paramType);
                        return params.length === 0?null:(
                        <Tab id={index} key={index} title={paramHash[paramType]} panel={
                            <Callout>
                                <HTMLTable style={{width:"100%"}}>
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <td>Value</td>
                                            <td>Random</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.values(params).map((param: parameter, index: number) => (
                                            <tr key={index}>
                                                <td>{param.name}</td>
                                                <td>
                                                    <InputGroup type="text" placeholder={param.type||"unknown"} disabled/>
                                                </td>
                                                <td style={{textAlign:'center'}}>
                                                    <Switch 
                                                        defaultChecked
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </HTMLTable>
                            </Callout>
                        }/>)
                    })}
                </Tabs>
                </>
                ):null}
                <h3>Valid Responses</h3>
                <OperationSelect responses={operationObj.responses}/>
            </div>
        </div>
    )
}
