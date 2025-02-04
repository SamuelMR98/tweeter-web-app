import React from "react";
import { Link } from "react-router-dom";
import { Status, User, AuthToken } from "tweeter-shared";

import Post from "./Post";

interface StatusItemProps {
    item: Status;
    navigateToUser: (event: React.MouseEvent, alias: string) => Promise<void>;
}

const StatusItem: React.FC<StatusItemProps> = ({ item, navigateToUser }) => {
    return (
        <div className="row mb-3 mx-0 px-0 border rounded bg-white">
        <div className="col bg-light mx-0 px-0">
            <div className="container px-0">
            <div className="row mx-0 px-0">
                <div className="col-auto p-3">
                <img
                    src={item.user.imageUrl}
                    className="img-fluid"
                    width="80"
                    alt="Posting user"
                />
                </div>
                <div className="col">
                <h2>
                    <b>
                    {item.user.firstName} {item.user.lastName}
                    </b>{" "}
                    -{" "}
                    <Link
                    to={item.user.alias}
                    onClick={(event) => navigateToUser(event, item.user.alias)}
                    >
                    {item.user.alias}
                    </Link>
                </h2>
                {item.formattedDate}
                <br />
                <Post status={item} />
                </div>
            </div>
            </div>
        </div>
        </div>
    );
};

export default StatusItem;