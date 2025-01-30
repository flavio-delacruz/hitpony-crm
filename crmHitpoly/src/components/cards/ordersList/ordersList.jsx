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

const OrdersList = () => {
  const orders = [
    {
      id: 1,
      icon: <NotificationsIcon color="success" />,
      name: "Lead #234 actualizado a 'Cerrado'",
      date: "(02 Ene, 10:30 AM)",
    },
    {
      id: 2,
      icon: <CodeIcon color="error" />,
      name: " Lead #567 movido a 'En Proceso'",
      date: "(02 Ene, 8:15 AM).",
    },
    {
      id: 3,
      icon: <ShoppingCartIcon color="primary" />,
      name: "Nuevo lead captado desde formulario #0034",
      date: "(01 Ene, 9:00 PM).",
    },
  ];

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 360,
        margin: { xs: "10px 0", sm: "20px auto" },
        height: "100%",
      }}
    >
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
