import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import PropTypes from "prop-types";

export function FilterDialog({ triggerIcon, title, description, children }) {
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="outline" size="icon">
          {triggerIcon}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <p>{description}</p>}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}

FilterDialog.propTypes = {
  triggerIcon: PropTypes.element.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  children: PropTypes.node.isRequired,
};
