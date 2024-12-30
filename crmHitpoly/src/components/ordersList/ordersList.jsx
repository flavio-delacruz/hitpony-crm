import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CodeIcon from "@mui/icons-material/Code";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CreditCardIcon from "@mui/icons-material/CreditCard";

const OrdersList = () => {
  const orders = [
    {
      id: 1,
      icon: <NotificationsIcon color="success" />,
      name: "$2400, Design changes",
      date: "22 DEC 7:20 PM",
    },
    {
      id: 2,
      icon: <CodeIcon color="error" />,
      name: "New order #1832412",
      date: "21 DEC 11 PM",
    },
    {
      id: 3,
      icon: <ShoppingCartIcon color="primary" />,
      name: "Server payments for April",
      date: "21 DEC 9:34 PM",
    },
    {
      id: 4,
      icon: <CreditCardIcon color="warning" />,
      name: "New card added for order #4395133",
      date: "20 DEC 2:20 AM",
    },
  ];

  return (
    <div style={{ width: "100%", maxWidth: 360, margin: "20px auto" }}>
      <Typography
        variant="h6"
        component="div"
        gutterBottom
      >
        Orders Overview
      </Typography>
      <List>
        {orders.map((order) => (
          <ListItem
            key={order.id}
            alignItems="flex-start"
          >
            <ListItemIcon>{order.icon}</ListItemIcon>
            <ListItemText
              primary={order.name}
              secondary={
                <Typography
                  component="span"
                  variant="body2"
                  color="textSecondary"
                >
                  {order.date}
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default OrdersList;
