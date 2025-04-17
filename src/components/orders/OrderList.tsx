import React from "react";
import { motion } from "framer-motion";

export const OrderList: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex h-[400px] items-center justify-center rounded-lg border bg-surface dark:bg-surface-dark"
    >
      <p className="text-sm text-muted-foreground">
        Vos commandes récentes apparaîtront ici
      </p>
    </motion.div>
  );
};

export default OrderList;
