import { Model as Mhotel } from "./buildings/hotel";
import { Model as Mhouse1 } from "./buildings/house1";
import { Model as Mhouse2 } from "./buildings/house2";
import { Model as Mhouse3 } from "./buildings/house3";
import { Model as Mhouse4 } from "./buildings/house4";
import { Model as Mhouse5 } from "./buildings/house5";
import { Model as Mhouse6 } from "./buildings/house6";
import { Model as Mhouse7 } from "./buildings/house7";
import { Model as Moffice1 } from "./buildings/office1";
import { Model as Moffice2 } from "./buildings/office2";
import { Model as Moffice3 } from "./buildings/office3";
import { Model as Mpark1 } from "./buildings/park1";
import { Model as Mpark2 } from "./buildings/park2";
import { Model as Mpark3 } from "./buildings/park3";
import { Model as Mpark4 } from "./buildings/park4";
import { Model as Mschool } from "./buildings/school";
import { Model as Mtree_four } from "./props/tree-four";
import { Model as Mtree_one } from "./props/tree-one";
import { Model as Mtree_three } from "./props/tree-three";
import { Model as Mtree_two } from "./props/tree-two";
import { Model as Mstreet_end } from "./streets/street-end";
import { Model as Mstreet_four } from "./streets/street-four";
import { Model as Mstreet_straight } from "./streets/street-straight";
import { Model as Mstreet_three } from "./streets/street-three";
import { Model as Mstreet_turn } from "./streets/street-turn";
export const models = {
  streets: {
    "street-end": Mstreet_end,
    "street-four": Mstreet_four,
    "street-straight": Mstreet_straight,
    "street-three": Mstreet_three,
    "street-turn": Mstreet_turn,
  },
  buildings: {
    hotel: Mhotel,
    house1: Mhouse1,
    house2: Mhouse2,
    house3: Mhouse3,
    house4: Mhouse4,
    house5: Mhouse5,
    house6: Mhouse6,
    house7: Mhouse7,
    office1: Moffice1,
    office2: Moffice2,
    office3: Moffice3,
    park1: Mpark1,
    park2: Mpark2,
    park3: Mpark3,
    park4: Mpark4,
    school: Mschool,
  },
  props: {
    "tree-one": Mtree_one,
    "tree-two": Mtree_two,
    "tree-three": Mtree_three,
    "tree-four": Mtree_four,
  },
};
